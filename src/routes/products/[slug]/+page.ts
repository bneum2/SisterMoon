import { products } from '$lib/data/products';
import { error } from '@sveltejs/kit';

export function load({ params }) {
	const product = products.find(p => p.slug === params.slug);
	
	if (!product) {
		throw error(404, 'Product not found');
	}
	
	return {
		product
	};
}
