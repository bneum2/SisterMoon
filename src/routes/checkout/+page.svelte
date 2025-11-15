<script lang="ts">
	import { cart, cartItems, cartTotal } from '$lib/stores/cart';
	import { goto } from '$app/navigation';
	
	let loading = $state(false);
	let error = $state<string | null>(null);
	
	async function handleCheckout() {
		if ($cartItems.length === 0) {
			return;
		}

		// Filter out items without variant IDs (they can't be checked out)
		const itemsWithVariants = $cartItems.filter(item => item.variantId);
		
		if (itemsWithVariants.length === 0) {
			error = 'No valid items in cart. Please ensure all items have variants.';
			return;
		}

		loading = true;
		error = null;

		try {
			// Prepare line items for Shopify checkout
			const lineItems = itemsWithVariants.map(item => ({
				variantId: item.variantId!,
				quantity: item.quantity
			}));

			// Create checkout via API
			const response = await fetch('/api/checkout', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ lineItems })
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || 'Failed to create checkout');
			}

			if (data.checkoutUrl) {
				// Redirect to Shopify checkout
				window.location.href = data.checkoutUrl;
			} else {
				throw new Error('No checkout URL received');
			}
		} catch (err) {
			console.error('Checkout error:', err);
			error = err instanceof Error ? err.message : 'Failed to proceed to checkout';
			loading = false;
		}
	}
</script>

<div class="checkout-page">
	<div class="checkout-container">
		
		{#if $cartItems.length === 0}
			<div class="empty-cart">
				<p>Your cart is empty.</p>
				<a href="/" class="continue-shopping-text">Continue Shopping</a>
			</div>
		{:else}
			<div class="checkout-content">
				<div class="checkout-form-section">
					<h2 class="section-title">Checkout</h2>
					
					{#if error}
						<div class="error-message">
							{error}
						</div>
					{/if}
					
					<p class="checkout-description">
						Click below to complete your purchase securely through Shopify.
					</p>
					
					<span 
						class="checkout-text"
						class:disabled={loading || $cartItems.length === 0}
						onclick={() => !loading && $cartItems.length > 0 && handleCheckout()}
						onkeydown={(e) => e.key === 'Enter' && !loading && $cartItems.length > 0 && handleCheckout()}
						role="button"
						tabindex="0"
					>
						{loading ? 'Processing...' : 'Checkout'}
					</span>
				</div>
				
				<div class="order-summary">
					<h2 class="section-title">Order Summary</h2>
					<div class="summary-items">
						{#each $cartItems as item}
							<div class="summary-item">
								<img src={item.image} alt={item.name} class="summary-image" />
								<div class="summary-details">
									<p class="summary-name">{item.name}</p>
									{#if item.size}
										<p class="summary-size">Size: {item.size}</p>
									{/if}
									<p class="summary-quantity">Qty: {item.quantity}</p>
								</div>
								<p class="summary-price">${Math.round(parseFloat(item.price.replace(' USD', '').replace('$', '')) * item.quantity)}</p>
							</div>
						{/each}
					</div>
					
					<div class="summary-total">
						<div class="total-line">
							<span>Subtotal</span>
							<span>${Math.round($cartTotal)}</span>
						</div>
						<div class="total-line">
							<span>Shipping</span>
							<span>{$cartTotal > 100 ? 'Free' : '$10'}</span>
						</div>
						<div class="total-line final">
							<span>Total</span>
							<span>${Math.round($cartTotal + ($cartTotal > 100 ? 0 : 10))}</span>
						</div>
					</div>
				</div>
			</div>
		{/if}
	</div>
</div>

<style>
	.checkout-page {
		width: 100%;
		min-height: 100vh;
		padding: 2rem;
	}

	.checkout-container {
		max-width: 1200px;
		margin: 0 auto;
	}

	.empty-cart {
		text-align: center;
		padding: 4rem 2rem;
	}

	.empty-cart p {
		font-family: Helvetica, Arial, sans-serif;
		font-size: 0.75rem;
		color: #666;
		margin-bottom: 2rem;
	}

	.continue-shopping-text {
		font-family: Helvetica, Arial, sans-serif;
		font-size: 0.75rem;
		color: black;
		text-decoration: underline;
		text-underline-offset: 0.2em;
		text-decoration-thickness: 1px;
		transition: opacity 0.3s ease;
		display: inline-block;
	}

	.continue-shopping-text:hover {
		opacity: 0.7;
	}

	.checkout-content {
		display: grid;
		grid-template-columns: 1fr 400px;
		gap: 3rem;
	}

	.section-title {
		font-family: Helvetica, Arial, sans-serif;
		font-size: 0.75rem;
		font-weight: normal;
		color: black;
		margin-bottom: 1.5rem;
		margin-top: 2rem;
	}

	.section-title:first-child {
		margin-top: 0;
	}

	.checkout-text {
		font-family: Helvetica, Arial, sans-serif;
		font-size: 0.75rem;
		color: black;
		cursor: pointer;
		text-decoration: underline;
		text-underline-offset: 0.2em;
		text-decoration-thickness: 1px;
		transition: opacity 0.3s ease;
		margin-top: 0rem;
		display: inline-block;
	}

	.checkout-text:hover:not(.disabled) {
		opacity: 0.7;
	}

	.checkout-text.disabled {
		opacity: 0.3;
		cursor: not-allowed;
		text-decoration-color: #999;
	}

	.checkout-description {
		font-family: Helvetica, Arial, sans-serif;
		font-size: 0.75rem;
		margin-bottom: 1rem;
		line-height: 1.6;
	}

	.error-message {
		background: #fee;
		border: 1px solid #fcc;
		color: #c33;
		padding: 1rem;
		margin-bottom: 1.5rem;
		font-family: Helvetica, Arial, sans-serif;
		font-size: 0.75rem;
	}

	.order-summary {
		padding: 2rem;
		height: fit-content;
		position: sticky;
		top: 2rem;
	}

	.summary-items {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		margin-bottom: 2rem;
	}

	.summary-item {
		display: flex;
		gap: 1rem;
		align-items: flex-start;
	}

	.summary-image {
		width: 80px;
		height: 80px;
		object-fit: cover;
		flex-shrink: 0;
	}

	.summary-details {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.summary-name {
		font-family: Helvetica, Arial, sans-serif;
		font-size: 0.75rem;
		font-weight: normal;
		color: black;
		margin: 0;
	}

	.summary-size,
	.summary-quantity {
		font-family: Helvetica, Arial, sans-serif;
		font-size: 0.75rem;
		color: #666;
		margin: 0;
	}

	.summary-price {
		font-family: Helvetica, Arial, sans-serif;
		font-size: 0.75rem;
		font-weight: normal;
		color: black;
		margin: 0;
	}

	.summary-total {
		border-top: 1px solid black;
		padding-top: 1.5rem;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.total-line {
		display: flex;
		justify-content: space-between;
		font-family: Helvetica, Arial, sans-serif;
		font-size: 0.75rem;
		color: black;
	}

	.total-line.final {
		font-size: 0.75rem;
		font-weight: normal;
		padding-top: 0.75rem;
		border-top: 1px solid black;
		margin-top: 0.5rem;
	}

	@media (max-width: 1024px) {
		.checkout-content {
			grid-template-columns: 1fr;
		}

		.order-summary {
			position: static;
		}
	}
</style>

