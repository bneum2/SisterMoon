// Server-side API route to fetch products from Shopify
// This runs on the server to keep API credentials secure

import { fetchProductsFromShopify, convertShopifyProduct } from '$lib/shopify/client';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	try {
		const shopifyProducts = await fetchProductsFromShopify();
		const products = shopifyProducts.map(convertShopifyProduct);
		return json(products);
	} catch (error) {
		console.error('Error in products API route:', error);
		return json([], { status: 500 });
	}
};

