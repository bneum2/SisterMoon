<script lang="ts">
	import { cart, cartItems, cartTotal } from '$lib/stores/cart';
	import { goto } from '$app/navigation';
	
	// Form state
	let name = $state('');
	let email = $state('');
	let address = $state('');
	let city = $state('');
	let zipCode = $state('');
	let cardNumber = $state('');
	let expiryDate = $state('');
	let cvv = $state('');
	
	function handleCheckout(e: SubmitEvent) {
		e.preventDefault();
		// Here you would typically send the order to a backend
		// For now, just clear the cart and redirect
		cart.clear();
		alert('Order placed successfully!');
		goto('/');
	}
</script>

<div class="checkout-page">
	<div class="checkout-container">
		<h1 class="checkout-title">Checkout</h1>
		
		{#if $cartItems.length === 0}
			<div class="empty-cart">
				<p>Your cart is empty.</p>
				<a href="/" class="back-button">Continue Shopping</a>
			</div>
		{:else}
			<div class="checkout-content">
				<div class="checkout-form-section">
					<h2 class="section-title">Shipping Information</h2>
					<form class="checkout-form" onsubmit={handleCheckout}>
						<div class="form-group">
							<label for="name">Full Name</label>
							<input type="text" id="name" bind:value={name} required />
						</div>
						
						<div class="form-group">
							<label for="email">Email</label>
							<input type="email" id="email" bind:value={email} required />
						</div>
						
						<div class="form-group">
							<label for="address">Address</label>
							<input type="text" id="address" bind:value={address} required />
						</div>
						
						<div class="form-row">
							<div class="form-group">
								<label for="city">City</label>
								<input type="text" id="city" bind:value={city} required />
							</div>
							
							<div class="form-group">
								<label for="zip">Zip Code</label>
								<input type="text" id="zip" bind:value={zipCode} required />
							</div>
						</div>
						
						<h2 class="section-title">Payment Information</h2>
						
						<div class="form-group">
							<label for="card">Card Number</label>
							<input type="text" id="card" bind:value={cardNumber} placeholder="1234 5678 9012 3456" required />
						</div>
						
						<div class="form-row">
							<div class="form-group">
								<label for="expiry">Expiry Date</label>
								<input type="text" id="expiry" bind:value={expiryDate} placeholder="MM/YY" required />
							</div>
							
							<div class="form-group">
								<label for="cvv">CVV</label>
								<input type="text" id="cvv" bind:value={cvv} placeholder="123" required />
							</div>
						</div>
						
						<button type="submit" class="submit-button">
							Place Order
						</button>
					</form>
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
								<p class="summary-price">${(parseFloat(item.price.replace(' USD', '').replace('$', '')) * item.quantity).toFixed(2)}</p>
							</div>
						{/each}
					</div>
					
					<div class="summary-total">
						<div class="total-line">
							<span>Subtotal</span>
							<span>${$cartTotal.toFixed(2)}</span>
						</div>
						<div class="total-line">
							<span>Shipping</span>
							<span>{$cartTotal > 100 ? 'Free' : '$10.00'}</span>
						</div>
						<div class="total-line final">
							<span>Total</span>
							<span>${($cartTotal + ($cartTotal > 100 ? 0 : 10)).toFixed(2)}</span>
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

	.checkout-title {
		font-family: Helvetica, Arial, sans-serif;
		font-size: 0.75rem;
		font-weight: normal;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: black;
		margin-bottom: 2rem;
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

	.back-button {
		display: inline-block;
		padding: 1rem 2rem;
		background: black;
		color: white;
		text-decoration: none;
		font-family: Helvetica, Arial, sans-serif;
		font-size: 0.75rem;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		transition: background 0.3s ease;
	}

	.back-button:hover {
		background: #333;
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
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: black;
		margin-bottom: 1.5rem;
		margin-top: 2rem;
	}

	.section-title:first-child {
		margin-top: 0;
	}

	.checkout-form {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.form-group {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.form-group label {
		font-family: Helvetica, Arial, sans-serif;
		font-size: 0.75rem;
		font-weight: normal;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: black;
	}

	.form-group input {
		padding: 0.75rem;
		border: 1px solid black;
		background: white;
		font-family: Helvetica, Arial, sans-serif;
		font-size: 0.75rem;
		color: black;
	}

	.form-group input:focus {
		outline: none;
		border-color: #333;
	}

	.form-row {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1rem;
	}

	.submit-button {
		padding: 1rem 2rem;
		background: black;
		color: white;
		border: none;
		font-family: Helvetica, Arial, sans-serif;
		font-size: 0.75rem;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		cursor: pointer;
		transition: background 0.3s ease;
		margin-top: 1rem;
	}

	.submit-button:hover {
		background: #333;
	}

	.order-summary {
		background: #f8f8f8;
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

