// Server-side API route to fetch products from Shopify
// This runs on the server to keep API credentials secure

import { fetchProductsFromShopify, convertShopifyProduct } from '$lib/shopify/client';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	try {
		const shopifyProducts = await fetchProductsFromShopify();
		
		// Log for debugging
		console.log('Fetched products from Shopify:', shopifyProducts.length);
		
		// Convert Shopify products to our format
		const products = shopifyProducts.map(convertShopifyProduct);
		
		// If no products from Shopify, return empty array
		if (products.length === 0) {
			console.warn('No products returned from Shopify. Check environment variables and API credentials.');
		}
		
		return json(products);
	} catch (error) {
		console.error('Error in products API route:', error);
		return json([], { status: 500 });
	}
};

