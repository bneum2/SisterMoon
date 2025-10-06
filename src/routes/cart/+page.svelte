<script lang="ts">
	import { ShoppingBag, Trash2, Plus, Minus } from 'lucide-svelte';
	
	// Mock cart data
	let cartItems = [
		{
			id: 1,
			name: "Organic Cotton T-Shirt",
			price: 45,
			image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200&h=250&fit=crop",
			quantity: 2,
			size: "M"
		},
		{
			id: 2,
			name: "Sustainable Denim Jeans",
			price: 89,
			image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=200&h=250&fit=crop",
			quantity: 1,
			size: "L"
		}
	];
	
	$: subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
	$: shipping = subtotal > 100 ? 0 : 10;
	$: total = subtotal + shipping;
	
	function updateQuantity(id: number, change: number) {
		const item = cartItems.find(item => item.id === id);
		if (item) {
			item.quantity = Math.max(1, item.quantity + change);
		}
	}
	
	function removeItem(id: number) {
		cartItems = cartItems.filter(item => item.id !== id);
	}
</script>

<main class="cart-page">
	<div class="container">
		<div class="page-header">
			<h1>Shopping Cart</h1>
			<p>Review your items before checkout</p>
		</div>
		
		{#if cartItems.length > 0}
			<div class="cart-content">
				<div class="cart-items">
					{#each cartItems as item}
						<div class="cart-item">
							<div class="item-image">
								<img src={item.image} alt={item.name} />
							</div>
							
							<div class="item-details">
								<h3 class="item-name">{item.name}</h3>
								<p class="item-size">Size: {item.size}</p>
								<p class="item-price">${item.price}</p>
							</div>
							
							<div class="item-quantity">
								<button class="qty-btn" on:click={() => updateQuantity(item.id, -1)}>
									<Minus size={16} />
								</button>
								<span class="qty-number">{item.quantity}</span>
								<button class="qty-btn" on:click={() => updateQuantity(item.id, 1)}>
									<Plus size={16} />
								</button>
							</div>
							
							<div class="item-total">
								<p class="total-price">${(item.price * item.quantity).toFixed(2)}</p>
							</div>
							
							<div class="item-actions">
								<button class="remove-btn" on:click={() => removeItem(item.id)}>
									<Trash2 size={18} />
								</button>
							</div>
						</div>
					{/each}
				</div>
				
				<div class="cart-summary">
					<div class="summary-card">
						<h3>Order Summary</h3>
						
						<div class="summary-line">
							<span>Subtotal</span>
							<span>${subtotal.toFixed(2)}</span>
						</div>
						
						<div class="summary-line">
							<span>Shipping</span>
							<span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
						</div>
						
						<div class="summary-line total">
							<span>Total</span>
							<span>${total.toFixed(2)}</span>
						</div>
						
						<button class="checkout-btn">
							<ShoppingBag size={20} />
							Proceed to Checkout
						</button>
						
						<a href="/" class="continue-shopping">
							Continue Shopping
						</a>
					</div>
				</div>
			</div>
		{:else}
			<div class="empty-cart">
				<div class="empty-cart-icon">
					<ShoppingBag size={64} />
				</div>
				<h2>Your cart is empty</h2>
				<p>Looks like you haven't added any items to your cart yet.</p>
				<a href="/" class="btn btn-primary">
					Start Shopping
				</a>
			</div>
		{/if}
	</div>
</main>

<style>
	.cart-page {
		padding: 2rem 0;
		min-height: 100vh;
		background: white;
	}
	
	.page-header {
		text-align: center;
		margin-bottom: 3rem;
	}
	
	.page-header h1 {
		font-size: 2.5rem;
		margin-bottom: 0.5rem;
		color: black;
		font-weight: 400;
	}
	
	.page-header p {
		font-size: 1.1rem;
		color: black;
		font-weight: 300;
	}
	
	.cart-content {
		display: grid;
		grid-template-columns: 1fr 400px;
		gap: 3rem;
		align-items: start;
	}
	
	.cart-items {
		background: white;
		overflow: hidden;
	}
	
	.cart-item {
		display: grid;
		grid-template-columns: 120px 1fr auto auto auto;
		gap: 1.5rem;
		align-items: center;
		padding: 1.5rem;
		border-bottom: 1px solid #e0e0e0;
	}
	
	.cart-item:last-child {
		border-bottom: none;
	}
	
	.item-image {
		width: 120px;
		height: 120px;
		overflow: hidden;
	}
	
	.item-image img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
	
	.item-details h3 {
		font-size: 1.1rem;
		margin-bottom: 0.5rem;
		color: black;
		font-weight: 400;
	}
	
	.item-size {
		font-size: 0.9rem;
		color: black;
		margin-bottom: 0.5rem;
		font-weight: 300;
	}
	
	.item-price {
		font-size: 1rem;
		font-weight: 400;
		color: black;
	}
	
	.item-quantity {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}
	
	.qty-btn {
		width: 32px;
		height: 32px;
		border: 1px solid black;
		background: white;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		transition: background 0.3s ease;
	}
	
	.qty-btn:hover {
		background: #f0f0f0;
	}
	
	.qty-number {
		min-width: 30px;
		text-align: center;
		font-weight: 400;
		color: black;
	}
	
	.item-total {
		text-align: right;
	}
	
	.total-price {
		font-size: 1.1rem;
		font-weight: 400;
		color: black;
	}
	
	.remove-btn {
		background: none;
		border: none;
		color: black;
		cursor: pointer;
		padding: 0.5rem;
		transition: background 0.3s ease;
	}
	
	.remove-btn:hover {
		background: #f0f0f0;
	}
	
	.cart-summary {
		position: sticky;
		top: 2rem;
	}
	
	.summary-card {
		background: white;
		padding: 2rem;
		border: 1px solid #e0e0e0;
	}
	
	.summary-card h3 {
		font-size: 1.25rem;
		margin-bottom: 1.5rem;
		color: black;
		font-weight: 400;
	}
	
	.summary-line {
		display: flex;
		justify-content: space-between;
		margin-bottom: 1rem;
		padding-bottom: 0.5rem;
		border-bottom: 1px solid #e0e0e0;
		color: black;
		font-weight: 300;
	}
	
	.summary-line.total {
		font-size: 1.1rem;
		font-weight: 400;
		color: black;
		border-bottom: none;
		margin-bottom: 2rem;
	}
	
	.checkout-btn {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		padding: 1rem;
		background: black;
		color: white;
		border: none;
		font-size: 1rem;
		font-weight: 400;
		cursor: pointer;
		transition: background 0.3s ease;
		margin-bottom: 1rem;
	}
	
	.checkout-btn:hover {
		background: #333;
	}
	
	.continue-shopping {
		display: block;
		text-align: center;
		color: black;
		text-decoration: none;
		font-weight: 400;
		transition: color 0.3s ease;
	}
	
	.continue-shopping:hover {
		color: #666;
	}
	
	.empty-cart {
		text-align: center;
		padding: 4rem 2rem;
		background: white;
		border: 1px solid #e0e0e0;
	}
	
	.empty-cart-icon {
		color: black;
		margin-bottom: 2rem;
	}
	
	.empty-cart h2 {
		font-size: 2rem;
		margin-bottom: 1rem;
		color: black;
		font-weight: 400;
	}
	
	.empty-cart p {
		font-size: 1.1rem;
		color: black;
		margin-bottom: 2rem;
		font-weight: 300;
	}
	
	@media (max-width: 768px) {
		.cart-content {
			grid-template-columns: 1fr;
			gap: 2rem;
		}
		
		.cart-item {
			grid-template-columns: 1fr;
			gap: 1rem;
			text-align: center;
		}
		
		.item-image {
			width: 100%;
			height: 200px;
		}
		
		.item-quantity {
			justify-content: center;
		}
		
		.item-total {
			text-align: center;
		}
	}
</style>
