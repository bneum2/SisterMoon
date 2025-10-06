<script lang="ts">
	import type { PageData } from './$types';
	import { goto } from '$app/navigation';

	export let data: PageData;
	const { product } = data;

	function goBack() {
		goto('/');
	}
</script>

<main class="product-page">
	<div class="container">
		
		<div class="product-details">
			<div class="product-image">
				<img src={product.image} alt={product.name} />
			</div>
			
			<div class="product-info">
				<h1 class="product-title">{product.name}</h1>
				<div class="product-price">{product.price}</div>
			</div>
		</div>
	</div>
</main>

<style>
	.product-page {
		padding: 2rem 0 4rem 0;
		min-height: 80vh;
		background: white;
	}

	.container {
		width: 100%;
		max-width: 100%;
		margin: 0 auto;
		padding: 4rem 1rem;
	}

	.product-details {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0rem;
		align-items: start;
	}

	.product-image {
		width: 100%;
		aspect-ratio: 1;
		overflow: hidden;
	}

	.product-image img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.product-info {
		padding: 0rem 3rem ;
	}

	.product-title {
		font-size: 1.5rem;
		font-weight: 600;
		color: black;
		margin: 0 1rem 0rem 0;
	}

	.product-price {
		font-size: 1rem;
		font-weight: 400;
		color: black;
	}

	@media (max-width: 768px) {
		.product-details {
			grid-template-columns: 1fr;
			gap: 2rem;
		}
		
		.product-title {
			font-size: 1.5rem;
		}
		
		.product-price {
			font-size: 1.25rem;
		}
	}
</style>
