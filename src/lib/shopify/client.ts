// Shopify Storefront API client
// This file handles communication with Shopify's Storefront API

const SHOPIFY_STORE_DOMAIN = import.meta.env.PUBLIC_SHOPIFY_STORE_DOMAIN || '';
const SHOPIFY_STOREFRONT_ACCESS_TOKEN = import.meta.env.PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN || '';

export interface ShopifyProduct {
	id: string;
	title: string;
	handle: string;
	description: string;
	images: {
		edges: Array<{
			node: {
				url: string;
				altText: string | null;
			};
		}>;
	};
	variants: {
		edges: Array<{
			node: {
				id: string;
				title: string;
				price: {
					amount: string;
					currencyCode: string;
				};
				availableForSale: boolean;
				selectedOptions: Array<{
					name: string;
					value: string;
				}>;
			};
		}>;
	};
	options: Array<{
		name: string;
		values: string[];
	}>;
}

export interface ShopifyProductResponse {
	data?: {
		products: {
			edges: Array<{
				node: ShopifyProduct;
			}>;
		};
	};
	errors?: Array<{
		message: string;
		locations?: Array<{
			line: number;
			column: number;
		}>;
	}>;
}

// GraphQL query to fetch all products
const PRODUCTS_QUERY = `
	query getProducts {
		products(first: 250) {
			edges {
				node {
					id
					title
					handle
					description
					images(first: 1) {
						edges {
							node {
								url
								altText
							}
						}
					}
					variants(first: 100) {
						edges {
							node {
								id
								title
								price {
									amount
									currencyCode
								}
								availableForSale
								selectedOptions {
									name
									value
								}
							}
						}
					}
					options {
						name
						values
					}
				}
			}
		}
	}
`;

export async function fetchProductsFromShopify(): Promise<ShopifyProduct[]> {
	if (!SHOPIFY_STORE_DOMAIN || !SHOPIFY_STOREFRONT_ACCESS_TOKEN) {
		console.warn('Shopify credentials not configured.');
		console.warn('SHOPIFY_STORE_DOMAIN:', SHOPIFY_STORE_DOMAIN ? 'Set' : 'Missing');
		console.warn('SHOPIFY_STOREFRONT_ACCESS_TOKEN:', SHOPIFY_STOREFRONT_ACCESS_TOKEN ? 'Set' : 'Missing');
		return [];
	}

	try {
		const apiVersion = '2024-01';
		const url = `https://${SHOPIFY_STORE_DOMAIN}/api/${apiVersion}/graphql.json`;
		console.log('Fetching from Shopify:', url);
		
		const response = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_ACCESS_TOKEN
			},
			body: JSON.stringify({ query: PRODUCTS_QUERY })
		});

		if (!response.ok) {
			throw new Error(`Shopify API error: ${response.statusText}`);
		}

		const data: ShopifyProductResponse = await response.json();
		
		// Check for GraphQL errors
		if (data.errors) {
			console.error('Shopify GraphQL errors:', data.errors);
			return [];
		}
		
		if (data.data?.products?.edges) {
			const products = data.data.products.edges.map(edge => edge.node);
			console.log(`Successfully fetched ${products.length} products from Shopify`);
			return products;
		}
		
		console.warn('No products found in Shopify response');
		return [];
	} catch (error) {
		console.error('Error fetching products from Shopify:', error);
		if (error instanceof Error) {
			console.error('Error message:', error.message);
		}
		return [];
	}
}

// Convert Shopify product to our Product format
export function convertShopifyProduct(shopifyProduct: ShopifyProduct) {
	const firstImage = shopifyProduct.images.edges[0]?.node?.url || '';
	const firstVariant = shopifyProduct.variants.edges[0]?.node;
	const price = firstVariant?.price?.amount || '0';
	
	// Extract size options if available
	const sizeOption = shopifyProduct.options.find(opt => 
		opt.name.toLowerCase() === 'size' || opt.name.toLowerCase() === 'sizes'
	);
	const sizes = sizeOption?.values || [];

	// Convert variants to our format
	const variants = shopifyProduct.variants.edges.map(edge => ({
		id: edge.node.id.split('/').pop() || edge.node.id,
		shopifyId: edge.node.id,
		title: edge.node.title,
		price: edge.node.price,
		availableForSale: edge.node.availableForSale,
		selectedOptions: edge.node.selectedOptions
	}));

	return {
		id: shopifyProduct.id.split('/').pop() || shopifyProduct.id,
		shopifyId: shopifyProduct.id,
		name: shopifyProduct.title,
		price: price,
		image: firstImage,
		description: shopifyProduct.description || '',
		slug: shopifyProduct.handle,
		variants: variants,
		sizes: sizes
	};
}

