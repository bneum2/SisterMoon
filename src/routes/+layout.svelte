<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import '../app.css';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>Sister Moon - Sustainable Fashion</title>
	<meta name="description" content="Sister moooooon" />
</svelte:head>

<div class="layout">
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

	@media (max-width: 768px) {
		.layout {
			grid-template-columns: 1fr;
		}

		.sidebar {
			position: static;
			height: auto;
			width: 100%;
			flex-direction: row;
			justify-content: space-between;
			padding: 1rem;
		}

		.left-sidebar {
			position: static;
			width: 100%;
		}

		.right-sidebar {
			position: static;
			width: 100%;
		}

		.main-content {
			grid-column: 1;
			margin: 0;
		}

		.logo-container,
		.cart-container {
			justify-content: center;
		}
	}
</style>
