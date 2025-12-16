// Server-side API route to fetch products from Shopify
// This runs on the server to keep API credentials secure

import { fetchProductsFromShopify, convertShopifyProduct } from '$lib/shopify/client';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { env } from '$env/dynamic/public';

export const GET: RequestHandler = async () => {
	try {
		// Check if credentials are configured
		if (!env.PUBLIC_SHOPIFY_STORE_DOMAIN || !env.PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN) {
			console.error('Shopify credentials not configured. Please set PUBLIC_SHOPIFY_STORE_DOMAIN and PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN environment variables.');
			return json({ error: 'Shopify credentials not configured' }, { status: 500 });
		}

		const shopifyProducts = await fetchProductsFromShopify();
		
		if (shopifyProducts.length === 0) {
			console.warn('No products returned from Shopify. This could mean:');
			console.warn('1. No products exist in the store');
			console.warn('2. API credentials are invalid');
			console.warn('3. API permissions are insufficient');
		}
		
		const products = shopifyProducts.map(convertShopifyProduct);
		return json(products);
	} catch (error) {
		console.error('Error in products API route:', error);
		const errorMessage = error instanceof Error ? error.message : 'Unknown error';
		return json({ error: errorMessage }, { status: 500 });
	}
};

