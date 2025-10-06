<script lang="ts">
	import ProductCard from './ProductCard.svelte';
	import { products } from '$lib/data/products';
</script>

<section class="product-showcase">
	<div class="container">
		<div class="products-grid">
			{#each products as product (product.id)}
				<ProductCard {product} />
			{/each}
		</div>
	</div>
</section>

<style>
	.product-showcase {
		padding: 4rem 0;
		background: white;
		width: 100%;
		max-width: 100%;
	}

	.container {
		width: 100%;
		max-width: 100%;
		margin: 0 auto;
		padding: 0;
	}

	.products-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 3rem;
	}

	@media (max-width: 768px) {
		.product-showcase {
			padding: 2rem 0;
		}
		
		.container {
			padding: 0 1rem;
		}
		
		.products-grid {
			grid-template-columns: 1fr !important;
			gap: 0.5rem !important;
		}
	}

	@media (min-width: 769px) and (max-width: 1024px) {
		.products-grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}
</style>
