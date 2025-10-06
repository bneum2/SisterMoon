<script lang="ts">
	import type { Product } from '$lib/data/products';
	import { goto } from '$app/navigation';

	export let product: Product;

	function handleClick() {
		goto(`/products/${product.slug}`);
	}
</script>

<div class="product-card" on:click={handleClick} on:keydown={(e) => e.key === 'Enter' && handleClick()} role="button" tabindex="0">
	<div class="product-image">
		<img src={product.image} alt={product.name} />
	</div>
	<div class="product-words">
		<div class="product-title">{product.name}</div>
		<div class="product-price">${product.price}</div>
	</div>

</div>

<style>
	.product-card {
		background: white;
		cursor: pointer;
		display: flex;
		flex-direction: column;
		width: 100%;
		height: 1000px;
	}

	.product-image {
		width: 100%;
		height: 400px;
		overflow: hidden;
	}

	.product-image img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.product-title {
		font-size: .8rem;
		font-weight: 800;
		color: black;
		text-align: left;
		padding: 1rem 0 0.25rem 0;
		margin: 0;
		font-family: 'Helvetica', Arial, sans-serif;
	}
	.product-price {
		font-size: .8rem;
		font-weight: 200;
		color: black;
		text-align: left;
		padding: -3rem 0;
		margin: 0;
		font-family: 'Helvetica', Arial, sans-serif;
	}

	@media (max-width: 768px) {
		.product-image {
			height: 350px;
		}
		
		.product-title {
			font-size: 0.9rem;
			padding: 1rem 0 0.25rem 0;
		}

		.product-price {
			font-size: 0.8rem;
		}
	}
</style>
