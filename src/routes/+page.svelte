<script lang="ts">
	import { products, type Product } from '$lib/data/products';
	import { cart } from '$lib/stores/cart';
	
	// Available sizes - you can customize this per product
	const sizes = ['XS', 'S', 'M', 'L', 'XL'];
	
	// Track selected size for each product
	let selectedSizes = $state<Record<string, string>>({});
	
	function addToCart(product: Product) {
		const selectedSize = selectedSizes[product.id];
		if (selectedSize) {
			cart.addItem(
				product.id,
				product.name,
				product.price,
				product.image,
				selectedSize
			);
			// Clear selected size so user can add another size/item
			selectedSizes[product.id] = '';
		}
	}
</script>

<div class="product-page">
	<div class="products-list">
		{#each products as product}
			<div class="product-row">
				<img src={product.image} alt={product.name} class="product-image" />
				<div class="product-details">
					<div class="product-line-1">
						<h2 class="product-name">{product.name}</h2>
						<p class="product-price">{product.price}</p>
					</div>
					<div class="product-line-2">
						<div class="sizes-text">
							{#each sizes as size}
								<span 
									class="size-text"
									class:selected={selectedSizes[product.id] === size}
									onclick={() => selectedSizes[product.id] = size}
									onkeydown={(e) => e.key === 'Enter' && (selectedSizes[product.id] = size)}
									role="button"
									tabindex="0"
								>
									{size}
								</span>
							{/each}
						</div>
						<span 
							class="add-to-cart-text"
							class:disabled={!selectedSizes[product.id]}
							onclick={() => selectedSizes[product.id] && addToCart(product)}
							onkeydown={(e) => e.key === 'Enter' && selectedSizes[product.id] && addToCart(product)}
							role="button"
							tabindex="0"
						>
							Add to Cart
						</span>
					</div>
					<p class="product-description">{product.description}</p>
				</div>
			</div>
		{/each}
	</div>
</div>

<style>
	.product-page {
		width: 100%;
		min-height: 100vh;
		padding: 2rem;
	}

	.products-list {
		display: flex;
		flex-direction: column;
		gap: 3rem;
		width: 100%;
		max-width: 1200px;
		margin: 0 auto;
	}

	.product-row {
		display: flex;
		gap: 3rem;
		align-items: flex-start;
	}

	.product-image {
		width: 400px;
		height: auto;
		flex-shrink: 0;
		display: block;
		object-fit: cover;
	}

	.product-details {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		flex: 1;
	}

	.product-line-1 {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
	}

	.product-name {
		font-family: Helvetica, Arial, sans-serif;
		font-size: 0.75rem;
		font-weight: normal;
		color: black;
		margin: 0;
	}

	.product-price {
		font-family: Helvetica, Arial, sans-serif;
		font-size: 0.75rem;
		font-weight: normal;
		color: black;
		margin: 0;
	}

	.product-line-2 {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
	}

	.sizes-text {
		display: flex;
		gap: 1rem;
		font-family: Helvetica, Arial, sans-serif;
		font-size: 0.75rem;
		color: black;
	}

	.size-text {
		cursor: pointer;
		transition: opacity 0.3s ease;
		text-decoration: none;
		position: relative;
	}

	.size-text:hover {
		opacity: 0.6;
	}

	.size-text.selected {
		text-decoration: underline;
		text-underline-offset: 0.2em;
		text-decoration-thickness: 1px;
	}

	.add-to-cart-text {
		font-family: Helvetica, Arial, sans-serif;
		font-size: 0.75rem;
		color: black;
		cursor: pointer;
		text-decoration: underline;
		transition: opacity 0.3s ease;
	}

	.add-to-cart-text:hover:not(.disabled) {
		opacity: 0.6;
	}

	.add-to-cart-text.disabled {
		opacity: 0.3;
		cursor: not-allowed;
		text-decoration: none;
	}

	.product-description {
		font-family: Helvetica, Arial, sans-serif;
		font-size: 0.75rem;
		line-height: 1.6;
		color: #666;
		margin: 0;
	}

	@media (max-width: 1024px) {
		.product-page {
			padding: 1rem;
		}

		.product-row {
			flex-direction: column;
			gap: 2rem;
		}

		.product-image {
			width: 100%;
		}
	}
</style>

