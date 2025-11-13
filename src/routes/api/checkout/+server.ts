// Server-side API route to create Shopify checkout
import { createCheckout } from '$lib/shopify/checkout';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { lineItems } = await request.json();

		if (!lineItems || !Array.isArray(lineItems) || lineItems.length === 0) {
			return json({ error: 'Invalid line items' }, { status: 400 });
		}

		// Validate line items have required fields
		for (const item of lineItems) {
			if (!item.variantId || !item.quantity || item.quantity <= 0) {
				return json({ error: 'Invalid line item format' }, { status: 400 });
			}
		}

		const checkoutUrl = await createCheckout(lineItems);

		if (!checkoutUrl) {
			return json({ error: 'Failed to create checkout' }, { status: 500 });
		}

		return json({ checkoutUrl });
	} catch (error) {
		console.error('Error in checkout API route:', error);
		return json(
			{ error: error instanceof Error ? error.message : 'Failed to create checkout' },
			{ status: 500 }
		);
	}
};

