<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import '../app.css';
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';

	let { children } = $props();
	let isMobile = false;

	onMount(() => {
		const checkMobile = () => {
			const width = window.innerWidth;
			isMobile = width <= 768;
			console.log('Screen width:', width, 'isMobile:', isMobile);
		};
		
		checkMobile();
		window.addEventListener('resize', checkMobile);
		
		return () => {
			window.removeEventListener('resize', checkMobile);
		};
	});

	// Force reactivity
	$effect(() => {
		console.log('isMobile changed to:', isMobile);
		console.log('About to render:', isMobile ? 'MOBILE' : 'DESKTOP');
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>Sister Moon - Sustainable Fashion</title>
	<meta name="description" content="Sister moooooon" />
</svelte:head>

{#if isMobile}
	<!-- Mobile Layout -->
	<div class="mobile-layout" style="border: 3px solid red;" key="mobile">
		<!-- Mobile Header -->
		<header class="mobile-header">
			<div class="mobile-logo">
				<a href="/" class="logo-link">
					<img src="/logo.png" alt="Sister Moon Logo" class="logo" />
				</a>
			</div>
			<div class="mobile-cart">
				<a href="/cart" class="cart-link">Cart</a>
			</div>
		</header>
		
		<!-- Mobile Main Content -->
		<main class="mobile-main">
			{@render children?.()}
		</main>
	</div>
{:else}
	<!-- Desktop Layout -->
	<div class="layout" style="border: 3px solid blue;" key="desktop">
		<!-- Left Sidebar -->
		<div class="sidebar left-sidebar">
			<div class="logo-container">
				<a href="/" class="logo-link">
					<img src="/logo.png" alt="Sister Moon Logo" class="logo" />
				</a>
			</div>
		</div>

		<!-- Main Content -->
		<main class="main-content">
			{@render children?.()}
		</main>

		<!-- Right Sidebar -->
		<div class="sidebar right-sidebar">
			<div class="cart-container">
				<a href="/cart" class="cart-link">Cart</a>
			</div>
		</div>
	</div>
{/if}

<style>
	.layout {
		display: grid;
		grid-template-columns: 100px 1fr 100px;
		min-height: 100vh;
	}

	.sidebar {
		background: white;
		position: fixed;
		top: 0;
		height: 100vh;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 2rem 1rem;
		z-index: 10;
	}

	.left-sidebar {
		left: 30px;
		width: 100px;
	}

	.right-sidebar {
		right: 30px;
		width: 100px;
	}

	.main-content {
		grid-column: 2;
		margin-left: 100px;
		margin-right: 100px;
		background: white;
		min-height: 100vh;
	}

	.logo-container {
		display: flex;
		justify-content: center;
		align-items: flex-start;
	}

	.logo-link {
		text-decoration: none;
	}

	.logo {
		max-width: 60px;
		height: auto;
	}

	.cart-container {
		display: flex;
		justify-content: center;
		align-items: flex-start;
	}

	.cart-link {
		font-family: 'Helvetica', Arial, sans-serif;
		font-size: .8rem;
		font-weight: 800;
		color: black;
		text-decoration: none;
		transition: color 0.3s ease;
	}

	.cart-link:hover {
		color: #666;
	}

	@media (max-width: 1024px) {
		.layout {
			grid-template-columns: 80px 1fr 80px;
		}

		.sidebar {
			width: 80px;
		}

		.left-sidebar {
			width: 80px;
		}

		.right-sidebar {
			width: 80px;
		}

		.main-content {
			margin-left: 80px;
			margin-right: 80px;
		}

		.logo {
			max-width: 50px;
		}
	}

	/* Mobile Layout Styles */
	.mobile-layout {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

	.mobile-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1rem;
		border-bottom: 1px solid #e0e0e0;
		background: white;
		position: sticky;
		top: 0;
		z-index: 10;
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
		max-width: 50px;
		height: auto;
	}

	.mobile-header .cart-link {
		font-family: 'Helvetica', Arial, sans-serif;
		font-size: 16px;
		font-weight: 600;
		color: black;
		text-decoration: none;
		transition: color 0.3s ease;
	}

	.mobile-header .cart-link:hover {
		color: #666;
	}
</style>
