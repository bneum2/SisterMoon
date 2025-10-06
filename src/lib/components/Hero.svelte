<script lang="ts">
	import { ArrowRight } from 'lucide-svelte';
	
	let currentSlide = 0;
	const totalSlides = 4;
	
	function nextSlide() {
		currentSlide = (currentSlide + 1) % totalSlides;
	}
	
	function prevSlide() {
		currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
	}
	
	// Preload the background image to prevent flashing
	const img = new Image();
	img.src = '/Banner.png';
	
	// Auto-advance carousel every 5 seconds
	setInterval(() => {
		nextSlide();
	}, 5000);
</script>

<section class="hero">
	<div class="carousel-container">
		{#each Array(totalSlides) as _, index}
			<div class="hero-slide" class:active={index === currentSlide}>
				<div class="hero-background">
					<div class="hero-overlay"></div>
				</div>
			</div>
		{/each}
	</div>
	
	<div class="hero-content">
		<div class="logo-container">
			<img src="/logo.png" alt="Sister Moon Logo" class="hero-logo" />
		</div>
	</div>
	
	
	<!-- Carousel Indicators -->
	<div class="carousel-indicators">
		{#each Array(totalSlides) as _, index}
			<button 
				class="indicator" 
				class:active={index === currentSlide}
				on:click={() => currentSlide = index}
			></button>
		{/each}
	</div>
</section>

<style>
	.hero {
		position: relative;
		min-height: 80vh;
		display: flex;
		align-items: center;
		justify-content: center;
		overflow: hidden;
		width: 100%;
		max-width: 100%;
	}

	.carousel-container {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
	}

	.hero-slide {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		opacity: 0;
		transition: opacity 0.3s ease-in-out;
	}

	.hero-slide.active {
		opacity: 1;
	}
	
	.hero-background {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-image: url('/Banner.png');
		background-size: cover;
		background-position: center;
		background-repeat: no-repeat;
		z-index: 1;
	}
	
	.hero-content {
		position: relative;
		z-index: 2;
		text-align: center;
		max-width: 800px;
		margin: 0 auto;
		padding: 0 1rem;
	}
	
	.logo-container {
		margin-bottom: 2rem;
	}
	
	.hero-logo {
		max-width: 200px;
		width: 100%;
		height: auto;
		margin: 0 auto;
		filter: brightness(0) invert(1);
	}
	
	
	@media (max-width: 768px) {
		.hero {
			min-height: 70vh;
		}
		
		.hero-logo {
			max-width: 250px;
		}
		
	}


	/* Carousel Indicators */
	.carousel-indicators {
		position: absolute;
		bottom: 20px;
		left: 10%;
		transform: translateX(-50%);
		display: flex;
		gap: 10px;
		z-index: 3;
	}

	.indicator {
		width: 16px;
		height: 16px;
		border-radius: 50%;
		border: none;
		background: rgba(255, 255, 255, 0.5);
		cursor: pointer;
		transition: background 0.3s ease;
		position: relative;
	}

	.indicator.active {
		background: transparent;
		position: relative;
	}

	.indicator.active::before {
		content: '';
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 16px;
		height: 16px;
		background-image: url('/crescent.svg');
		background-size: contain;
		background-repeat: no-repeat;
		background-position: center;
		filter: brightness(0) invert(1);
	}

	.indicator:hover {
		background: rgba(255, 255, 255, 0.8);
	}

	.indicator.active:hover {
		background: transparent;
	}

	.indicator.active:hover::before {
		filter: brightness(0) invert(1) opacity(0.8);
	}
</style>
