// Shopify checkout functions
import { env } from '$env/dynamic/public';

const SHOPIFY_STORE_DOMAIN = env.PUBLIC_SHOPIFY_STORE_DOMAIN || '';
const SHOPIFY_STOREFRONT_ACCESS_TOKEN = env.PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN || '';

export interface CheckoutLineItem {
	variantId: string;
	quantity: number;
}

export interface CreateCheckoutResponse {
	data?: {
		cartCreate?: {
			cart?: {
				id: string;
				checkoutUrl: string;
			};
			userErrors?: Array<{
				field: string[];
				message: string;
			}>;
		};
		checkoutCreate?: {
			checkout?: {
				id: string;
				webUrl: string;
			};
			checkoutUserErrors?: Array<{
				field: string[];
				message: string;
			}>;
		};
	};
	errors?: Array<{
		message: string;
	}>;
}

/**
 * Create a Shopify checkout with line items
 */
export async function createCheckout(lineItems: CheckoutLineItem[]): Promise<string | null> {
	if (!SHOPIFY_STORE_DOMAIN || !SHOPIFY_STOREFRONT_ACCESS_TOKEN) {
		throw new Error('Shopify credentials not configured');
	}

	if (lineItems.length === 0) {
		throw new Error('Cannot create checkout with empty cart');
	}

	// Validate and clean store domain format
	let storeDomain = SHOPIFY_STORE_DOMAIN.trim();
	// Remove https:// if present
	storeDomain = storeDomain.replace(/^https?:\/\//, '');
	// Remove trailing slash
	storeDomain = storeDomain.replace(/\/$/, '');

	// Try cartCreate first (newer API), fallback to checkoutCreate (older API)
	const mutation = `
		mutation cartCreate($input: CartInput!) {
			cartCreate(input: $input) {
				cart {
					id
					checkoutUrl
				}
				userErrors {
					field
					message
				}
			}
		}
	`;

	const variables = {
		input: {
			lines: lineItems.map(item => ({
				merchandiseId: item.variantId,
				quantity: item.quantity
			}))
		}
	};

	try {
		const response = await fetch(`https://${storeDomain}/api/2024-01/graphql.json`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_ACCESS_TOKEN
			},
			body: JSON.stringify({
				query: mutation,
				variables
			})
		});

		const data: CreateCheckoutResponse = await response.json();

		if (data.errors) {
			console.error('GraphQL errors:', data.errors);
			throw new Error(data.errors[0]?.message || 'Failed to create checkout');
		}

		// Try cartCreate first (newer API)
		if (data.data?.cartCreate) {
			if (data.data.cartCreate.userErrors?.length) {
				const errors = data.data.cartCreate.userErrors;
				console.error('Cart user errors:', errors);
				throw new Error(errors[0]?.message || 'Failed to create cart');
			}

			const checkoutUrl = data.data.cartCreate.cart?.checkoutUrl;
			if (checkoutUrl) {
				return checkoutUrl;
			}
		}

		// Fallback to checkoutCreate (older API)
		if (data.data?.checkoutCreate) {
			if (data.data.checkoutCreate.checkoutUserErrors?.length) {
				const errors = data.data.checkoutCreate.checkoutUserErrors;
				console.error('Checkout user errors:', errors);
				throw new Error(errors[0]?.message || 'Failed to create checkout');
			}

			const checkoutUrl = data.data.checkoutCreate.checkout?.webUrl;
			if (checkoutUrl) {
				return checkoutUrl;
			}
		}

		throw new Error('No checkout URL returned');
	} catch (error) {
		console.error('Error creating checkout:', error);
		throw error;
	}
}

