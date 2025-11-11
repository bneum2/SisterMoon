<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import '../app.css';
	import { cart, cartItems, cartItemCount, cartTotal } from '$lib/stores/cart';
	import { X } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import { slide } from 'svelte/transition';

	let { children } = $props();
	let checkoutLineElement: HTMLElement;
	let lineTop = $state(0);
	// Adjust this value to move the line up (negative) or down (positive)
	let lineOffset = $state(-8);
	
	function removeCartItem(itemId: string) {
		cart.removeItem(itemId);
	}

	onMount(() => {
		function updateLinePosition() {
			if (checkoutLineElement) {
				const rect = checkoutLineElement.getBoundingClientRect();
				lineTop = rect.top + lineOffset;
			} else {
				// If element not found, set to a default value to avoid top positioning
				lineTop = window.innerHeight - 200;
			}
		}
		// Wait for DOM to be ready
		setTimeout(() => {
			updateLinePosition();
		}, 100);
		// Update on scroll and resize
		window.addEventListener('scroll', updateLinePosition);
		window.addEventListener('resize', updateLinePosition);
		// Update when cart changes
		const unsubscribe = cartItems.subscribe(() => {
			setTimeout(updateLinePosition, 100);
		});
		return () => {
			window.removeEventListener('scroll', updateLinePosition);
			window.removeEventListener('resize', updateLinePosition);
			unsubscribe();
		};
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>Sister Moon</title>
	<meta name="description" content="Sister moooooon" />
</svelte:head>

<!-- Mobile Layout -->
<div class="mobile-layout">
	<!-- Mobile Header -->
	<header class="mobile-header">
		<div class="mobile-logo">
			<a href="/" class="logo-link">
				<img src="/new_logo.png" alt="Sister Moon Logo" class="logo" />
			</a>
		</div>
		<div class="mobile-cart">
			<span class="cart-link">Cart ({$cartItemCount})</span>
		</div>
	</header>
	
	<!-- Mobile Main Content -->
	<main class="mobile-main">
		{@render children?.()}
	</main>
</div>

<!-- Desktop Layout -->
<div class="desktop-layout">
	<!-- Left Sidebar -->
	<div class="left-sidebar">
		<!-- Logo at top -->
		<div class="sidebar-logo">
			<a href="/" class="logo-link">
				<img src="/new_logo.png" alt="Sister Moon Logo" class="logo-img" />
			</a>
		</div>
		
		<!-- Cart at bottom -->
		<div class="sidebar-cart">
			<div class="cart-header" class:empty={$cartItems.length === 0}>
				<h3 class="cart-title">Cart</h3>
			</div>
			<div class="cart-items-list">
					{#each $cartItems as item (item.id)}
						<div class="cart-item" transition:slide={{ duration: 300 }}>
							<div class="cart-item-details">
								<p class="cart-item-name">{item.name}</p>
								{#if item.size}
									<p class="cart-item-size">{item.size}</p>
								{/if}
							</div>
							<div class="cart-item-right">
								<button 
									class="remove-item-button"
									onclick={() => removeCartItem(item.id)}
									aria-label="Remove item"
								>
									<X size={14} />
								</button>
								<p class="cart-item-price">{item.price}</p>
							</div>
					</div>
					{/each}
					<div class="checkout-line" bind:this={checkoutLineElement}>
						{#if lineTop > 0}
							<div class="checkout-line-border" style="top: {lineTop}px"></div>
						{/if}
						<div class="checkout-container">
							<a href="/checkout" class="checkout-button">
								Checkout
							</a>
							<p class="total-amount">{$cartTotal}</p>
						</div>
					</div>

			</div>
		</div>
	</div>
	
	<!-- Main Content Area -->
	<main class="main-content">
		{@render children?.()}
	</main>
</div>

<style>
	@font-face {
		font-family: 'BagnardSans';
		src: url('/BagnardSans.otf') format('opentype');
		font-weight: normal;
		font-style: normal;
	}

	.desktop-layout {
		display: flex;
		min-height: 100vh;
		background: white;
	}

	/* Left Sidebar */
	.left-sidebar {
		position: fixed;
		left: 0;
		bottom: 0;
		width: 250px;
		height: 100vh;
		background: white;
		border-right: 1px solid black;
		display: flex;
		flex-direction: column;
		z-index: 20;
		overflow-y: auto;
		overflow-x: visible;
	}

	.sidebar-logo {
		padding: 2rem;
	}

	.sidebar-logo .logo-link {
		display: block;
		text-decoration: none;
	}

	.logo-img {
		width: 100%;
		height: auto;
		max-width: 300px;
	}

	.sidebar-cart {
		margin-top: auto;
		display: flex;
		flex-direction: column;
		padding: 2rem;
		min-height: 0;
		position: relative;
		overflow-x: visible;
	}

	.cart-header {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		flex-shrink: 0;
		transition: transform 0.3s ease;
	}

	.cart-header.empty {
		margin-bottom: 1rem;
	}

	.cart-items-list {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		flex: 1;
		overflow-y: auto;
		min-height: 0;
		margin-bottom: 0rem;
	}

	.cart-title {
		font-family: Helvetica, Arial, sans-serif;
		font-size: 0.75rem;
		font-weight: normal;
		letter-spacing: 0em;
		margin-bottom: 0.5rem;
		text-decoration: underline;
		color: black;
	}

	.empty-cart-message {
		font-family: Helvetica, Arial, sans-serif;
		font-size: 0.75rem;
		color: #666;
		margin: 0;
	}

	.cart-item {
		display: flex;
		gap: 0.75rem;
		padding: 0rem 0;
		align-items: flex-start;
		transition: transform 0.3s ease;
	}

	.cart-item:last-of-type {
		border-bottom: none;
	}

	.cart-item-details {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		min-width: 0;
	}

	.cart-item-name {
		font-family: Helvetica, Arial, sans-serif;
		font-size: 0.75rem;
		font-weight: normal;
		color: black;
		margin: 0;
	}

	.cart-item-size {
		font-family: Helvetica, Arial, sans-serif;
		font-size: 0.75rem;
		color: #666;
		margin: 0;
	}

	.cart-item-right {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		gap: 0.25rem;
		flex-shrink: 0;
	}

	.cart-item-price {
		font-family: Helvetica, Arial, sans-serif;
		font-size: 0.75rem;
		color: black;
		margin: 0;
	}

	.remove-item-button {
		background: none;
		border: none;
		cursor: pointer;
		padding: 0.25rem;
		color: #666;
		transition: color 0.3s ease;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-right: -0.25rem;
	}

	.remove-item-button:hover {
		color: black;
	}

	.total-amount {
		font-family: Helvetica, Arial, sans-serif;
		font-size: 0.75rem;
		font-weight: normal;
		color: black;
		margin: 0;
	}

	.checkout-line {
		position: relative;
		margin-top: 0rem;
		margin-left: -2rem;
		margin-right: -2rem;
		padding-left: 2rem;
		padding-right: 2rem;
	}

	.checkout-line-border {
		position: fixed;
		left: -100vw;
		right: calc(100vw - 250px);
		height: 1px;
		background: black;
		z-index: 100;
		pointer-events: none;
	}

	.checkout-container {
		display: flex;
		justify-content: space-between;
		align-items: center;
		position: relative;
		padding-top: 1rem;
	}

	.checkout-button {
		padding: 0rem;
		color: rgb(0, 0, 0);
		text-align: left;
		text-decoration: none;
		font-family: Helvetica, Arial, sans-serif;
		font-size: 0.75rem;
		text-decoration: underline;
		letter-spacing: 0.0em;
		transition: background 0.3s ease;
	}

	.checkout-button:hover {
		background: #333;
	}

	/* Main Content */
	.main-content {
		margin-left: 250px;
		flex: 1;
		background: white;
		min-height: 100vh;
		position: relative;
		z-index: 10;
	}

	@media (max-width: 1024px) {
		.left-sidebar {
			width: 250px;
		}

		.main-content {
			margin-left: 250px;
		}
	}

	/* Mobile Layout Styles */
	.mobile-layout {
		display: none;
		flex-direction: column;
		min-height: 100vh;
	}

	.mobile-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1rem;
		background: white;
		position: sticky;
		top: 0;
		z-index: 10;
		margin-top: 1rem;
		border-bottom: 1px solid black;
	}

	.mobile-logo {
		display: flex;
		align-items: center;
	}

	.mobile-cart {
		display: flex;
		align-items: center;
	}

	.mobile-main {
		flex: 1;
		background: white;
		width: 100%;
	}

	.mobile-header .logo {
		max-width: 150px;
		height: auto;
	}

	.mobile-header .cart-link {
		font-family: Helvetica, Arial, sans-serif;
		font-size: 0.75rem;
		font-weight: normal;
		color: black;
		text-decoration: none;
		transition: color 0.3s ease;
	}

	.mobile-header .cart-link:hover {
		color: #666;
	}

	/* Mobile responsive */
	@media (max-width: 768px) {
		.desktop-layout {
			display: none;
		}
		
		.mobile-layout {
			display: flex;
		}
	}
</style>
