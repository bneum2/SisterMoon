<script lang="ts">
	import { onMount } from 'svelte';
	import { cart } from '$lib/stores/cart';
	import type { Product } from '$lib/data/products';
	
	// Fetch products from API (which gets them from Shopify)
	let products = $state<Product[]>([]);
	let loading = $state(true);
	
	// Track current image index for each product
	let productImageIndices = $state<Record<string, number>>({});
	
	// Track expanded sections for each product
	let expandedSections = $state<Record<string, Set<string>>>({});
	
	// Parse description into sections
	function parseDescription(description: string): Array<{ title: string; content: string }> {
		if (!description) return [];
		
		// Clean HTML tags but preserve structure
		const cleanDescription = description.replace(/<[^>]*>/g, '').trim();
		
		// Try to parse HTML sections first (if HTML exists)
		const htmlMatch = description.match(/<h[2-6][^>]*>(.*?)<\/h[2-6]>/gi);
		if (htmlMatch && htmlMatch.length > 0) {
			const sections: Array<{ title: string; content: string }> = [];
			let lastIndex = 0;
			
			htmlMatch.forEach((match, index) => {
				const titleMatch = match.match(/<h[2-6][^>]*>(.*?)<\/h[2-6]>/i);
				if (titleMatch) {
					const title = titleMatch[1].replace(/<[^>]*>/g, '').trim();
					const matchIndex = description.indexOf(match, lastIndex);
					
					// Get content between this header and the next one
					const nextMatch = htmlMatch[index + 1];
					const contentEnd = nextMatch 
						? description.indexOf(nextMatch, matchIndex + match.length)
						: description.length;
					
					const content = description
						.substring(matchIndex + match.length, contentEnd)
						.replace(/<[^>]*>/g, '')
						.trim();
					
					if (title && content) {
						sections.push({ title, content });
					}
					
					lastIndex = matchIndex;
				}
			});
			
			if (sections.length > 0) {
				return sections;
			}
		}
		
		// Try to parse text-based sections (e.g., "Details:", "Fit:", "Care:")
		// The description might be all on one line, so we need flexible patterns
		const sectionHeaders: Array<{ title: string; index: number }> = [];
		
		// Common section titles to look for
		const commonSections = ['Details', 'Fit', 'Care', 'Size', 'Shipping', 'Returns', 'Materials', 'Washing', 'Size Info'];
		
		// Pattern 1: Headers with newlines (if they exist)
		const headerPattern1 = /\n([A-Z][A-Za-z\s]+?):\s*\n/g;
		let headerMatch: RegExpExecArray | null;
		
		while ((headerMatch = headerPattern1.exec(cleanDescription)) !== null) {
			const title = headerMatch[1].trim();
			if (title.length < 30 && !title.includes('.')) {
				sectionHeaders.push({
					title: title,
					index: headerMatch.index + headerMatch[0].indexOf(headerMatch[1])
				});
			}
		}
		
		// Pattern 2: Headers at start of line
		const headerPattern2 = /(?:^|\n)([A-Z][A-Za-z\s]+?):\s*\n/gm;
		while ((headerMatch = headerPattern2.exec(cleanDescription)) !== null) {
			const title = headerMatch[1].trim();
			if (title.length < 30 && !title.includes('.')) {
				const existing = sectionHeaders.find(h => 
					Math.abs(h.index - headerMatch!.index) < 5 && h.title === title
				);
				if (!existing) {
					sectionHeaders.push({
						title: title,
						index: headerMatch.index + (headerMatch[0].startsWith('\n') ? 1 : 0)
					});
				}
			}
		}
		
		// Pattern 3: Headers followed by space and content (works for single-line descriptions)
		// Look for common section titles followed by ": " or ":\n"
		commonSections.forEach(sectionTitle => {
			// Try with space after colon: "Details: content"
			const pattern1 = new RegExp(`\\b${sectionTitle}:\\s+`, 'gi');
			let match;
			while ((match = pattern1.exec(cleanDescription)) !== null) {
				const existing = sectionHeaders.find(h => 
					Math.abs(h.index - match!.index) < 10 && h.title.toLowerCase() === sectionTitle.toLowerCase()
				);
				if (!existing) {
					sectionHeaders.push({
						title: sectionTitle,
						index: match.index
					});
				}
			}
			
			// Try with newline after colon: "Details:\ncontent"
			const pattern2 = new RegExp(`\\b${sectionTitle}:\\s*\\n`, 'gi');
			while ((match = pattern2.exec(cleanDescription)) !== null) {
				const existing = sectionHeaders.find(h => 
					Math.abs(h.index - match!.index) < 10 && h.title.toLowerCase() === sectionTitle.toLowerCase()
				);
				if (!existing) {
					sectionHeaders.push({
						title: sectionTitle,
						index: match.index
					});
				}
			}
			
			// Try with NO space after colon: "Fit:Content" or "Care:Content"
			// This matches colon followed immediately by a capital letter (start of content)
			const pattern3 = new RegExp(`\\b${sectionTitle}:(?=[A-Z])`, 'gi');
			while ((match = pattern3.exec(cleanDescription)) !== null) {
				const existing = sectionHeaders.find(h => 
					Math.abs(h.index - match!.index) < 10 && h.title.toLowerCase() === sectionTitle.toLowerCase()
				);
				if (!existing) {
					sectionHeaders.push({
						title: sectionTitle,
						index: match.index
					});
				}
			}
		});
		
		// Pattern 4: Generic pattern for any capitalized word followed by colon and space/newline
		// But only if we haven't found many sections yet (to avoid false positives)
		if (sectionHeaders.length === 0) {
			const headerPattern4 = /\b([A-Z][A-Za-z]+):\s+(?=[A-Z])/g;
			while ((headerMatch = headerPattern4.exec(cleanDescription)) !== null) {
				const title = headerMatch[1].trim();
				// Only accept if it looks like a section title (short, no lowercase in middle)
				if (title.length < 20 && title.length > 2 && /^[A-Z][a-z]+$/.test(title)) {
					sectionHeaders.push({
						title: title,
						index: headerMatch.index
					});
				}
			}
		}
		
		// Sort by index
		sectionHeaders.sort((a, b) => a.index - b.index);
		
		// Remove duplicates (same title at similar positions)
		const uniqueHeaders: Array<{ title: string; index: number }> = [];
		sectionHeaders.forEach(header => {
			const existing = uniqueHeaders.find(h => 
				h.title === header.title && Math.abs(h.index - header.index) < 10
			);
			if (!existing) {
				uniqueHeaders.push(header);
			}
		});
		uniqueHeaders.sort((a, b) => a.index - b.index);
		
		// If we found section headers, extract content for each
		if (uniqueHeaders.length > 0) {
			const textSections: Array<{ title: string; content: string }> = [];
			
			// Get intro text before first section (if any)
			const introText = cleanDescription.substring(0, uniqueHeaders[0].index).trim();
			if (introText) {
				textSections.push({ title: 'Description', content: introText });
			}
			
			// Extract each section
			uniqueHeaders.forEach((header, index) => {
				// Find where the header ends (after ": " or ":\n" or just ":")
				const textFromHeader = cleanDescription.substring(header.index);
				// Match the header title followed by colon (with optional whitespace)
				// This handles both "Details: " and "Fit:Content" formats
				const headerMatch = textFromHeader.match(new RegExp(`^${header.title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}:\\s*`, 'i'));
				
				if (headerMatch) {
					const contentStart = header.index + headerMatch[0].length;
					
					// Find the end of this section's content
					// It should end at the start of the next section header
					let contentEnd: number;
					if (index < uniqueHeaders.length - 1) {
						// Next header exists - content ends right before it
						contentEnd = uniqueHeaders[index + 1].index;
					} else {
						// Last section - content goes to end of description
						contentEnd = cleanDescription.length;
					}
					
					let content = cleanDescription
						.substring(contentStart, contentEnd)
						.trim();
					
					// Double-check: if content contains any other section headers, cut it off at the first one
					// This handles cases where headers weren't detected properly
					const otherHeaders = uniqueHeaders.slice(index + 1);
					for (const otherHeader of otherHeaders) {
						// Look for this header's title followed by colon in the content
						const headerInContent = new RegExp(`\\b${otherHeader.title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}:\\s*`, 'i');
						const match = content.match(headerInContent);
						if (match && match.index !== undefined) {
							// Found another section header in the content - cut it off here
							content = content.substring(0, match.index).trim();
							break;
						}
					}
					
					// Also check for any common section headers that might have been missed
					const commonHeaders = ['Details', 'Fit', 'Care', 'Size', 'Shipping', 'Returns'];
					for (const commonHeader of commonHeaders) {
						if (commonHeader.toLowerCase() === header.title.toLowerCase()) continue; // Skip current header
						
						const headerInContent = new RegExp(`\\b${commonHeader}:\\s*`, 'i');
						const match = content.match(headerInContent);
						if (match && match.index !== undefined) {
							// Found another section header - cut it off here
							content = content.substring(0, match.index).trim();
							break;
						}
					}
					
					if (content) {
						textSections.push({ title: header.title, content });
					}
				} else {
					// Fallback: try to find content after the colon
					const nextHeaderIndex = index < uniqueHeaders.length - 1 
						? uniqueHeaders[index + 1].index 
						: cleanDescription.length;
					
					// Look for the colon after the header title
					const headerWithColon = cleanDescription.substring(header.index);
					const colonMatch = headerWithColon.match(new RegExp(`^${header.title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}:`, 'i'));
					
					if (colonMatch) {
						const contentStart = header.index + colonMatch[0].length;
						let content = cleanDescription
							.substring(contentStart, nextHeaderIndex)
							.trim();
						
						// Remove leading whitespace/newlines
						content = content.replace(/^\s+/, '');
						
						// Check for other section headers in content and cut them off
						const commonHeaders = ['Details', 'Fit', 'Care', 'Size', 'Shipping', 'Returns'];
						for (const commonHeader of commonHeaders) {
							if (commonHeader.toLowerCase() === header.title.toLowerCase()) continue;
							
							const headerInContent = new RegExp(`\\b${commonHeader}:\\s*`, 'i');
							const match = content.match(headerInContent);
							if (match && match.index !== undefined) {
								content = content.substring(0, match.index).trim();
								break;
							}
						}
						
						if (content && !content.match(/^[A-Z][A-Za-z]+:\s*/)) {
							textSections.push({ title: header.title, content });
						}
					}
				}
			});
			
			if (textSections.length > 0) {
				return textSections;
			}
		}
		
		// If no sections found, return the whole description as a single section
		return [{ title: 'Description', content: cleanDescription }];
	}
	
	function toggleSection(productId: string, sectionTitle: string) {
		if (!expandedSections[productId]) {
			expandedSections[productId] = new Set();
		}
		// If clicking the same section, toggle it
		if (expandedSections[productId].has(sectionTitle)) {
			expandedSections[productId].delete(sectionTitle);
		} else {
			// Close all other sections and open this one (accordion behavior)
			expandedSections[productId].clear();
			expandedSections[productId].add(sectionTitle);
		}
		// Trigger reactivity
		expandedSections = { ...expandedSections };
	}
	
	function isSectionExpanded(productId: string, sectionTitle: string): boolean {
		return expandedSections[productId]?.has(sectionTitle) ?? false;
	}
	
	onMount(async () => {
		try {
			const response = await fetch('/api/products');
			if (response.ok) {
				const fetchedProducts = await response.json();
				products = fetchedProducts;
			} else {
				console.error('Failed to fetch products. Status:', response.status);
				const errorText = await response.text();
				console.error('Error response:', errorText);
			}
		} catch (error) {
			console.error('Error loading products:', error);
		} finally {
			loading = false;
		}
	});
	
	// Get sizes from product if available, otherwise use default
	function getSizes(product: Product): string[] {
		return product.sizes && product.sizes.length > 0 
			? product.sizes 
			: ['XS', 'S', 'M', 'L', 'XL'];
	}
	
	// Check if a size is in stock
	function isSizeInStock(product: Product, size: string): boolean {
		if (!product.variants || product.variants.length === 0) {
			// If no variants, assume in stock
			return true;
		}
		
		// Find variant with matching size
		const variant = product.variants.find(v => {
			const sizeOption = v.selectedOptions.find(opt => 
				opt.name.toLowerCase() === 'size' || opt.name.toLowerCase() === 'sizes'
			);
			return sizeOption?.value === size;
		});
		
		// Return true if variant exists and is available for sale
		return variant ? variant.availableForSale : false;
	}
	
	// Track selected size for each product
	let selectedSizes = $state<Record<string, string>>({});
	
	function addToCart(product: Product) {
		const selectedSize = selectedSizes[product.id];
		if (!selectedSize) {
			return;
		}
		if (!isSizeInStock(product, selectedSize)) {
			return;
		}
		
		// Find the variant ID for the selected size
		let variantId: string | undefined;
		if (product.variants) {
			const variant = product.variants.find(v => {
				const sizeOption = v.selectedOptions.find(opt => 
					opt.name.toLowerCase() === 'size' || opt.name.toLowerCase() === 'sizes'
				);
				return sizeOption?.value === selectedSize;
			});
			variantId = variant?.id;
		}
		
		cart.addItem(
			product.id,
			product.name,
			product.price,
			product.image,
			selectedSize,
			variantId
		);
		
		// Clear selected size so user can add another size/item
		selectedSizes[product.id] = '';
		// Force reactivity update
		selectedSizes = { ...selectedSizes };
	}
	
	function selectSize(productId: string, size: string, product: Product) {
		// Only allow selecting if in stock
		if (isSizeInStock(product, size)) {
			selectedSizes[productId] = size;
			// Force reactivity update
			selectedSizes = { ...selectedSizes };
		}
	}
</script>

<div class="product-page">
	{#if loading}
		<div class="loading">Loading products...</div>
	{:else if products.length === 0}
		<div class="no-products">No products available.</div>
	{:else}
		<div class="products-list">
			{#each products as product}
				{@const productImages = product.images && product.images.length > 0 ? product.images : [product.image]}
				{@const currentImageIndex = productImageIndices[product.id] ?? 0}
				<div class="product-row">
					<div class="product-image-container">
						{#if productImages.length > 1}
							<button 
								class="image-nav-button image-nav-prev"
								onclick={() => productImageIndices[product.id] = (currentImageIndex - 1 + productImages.length) % productImages.length}
								aria-label="Previous image"
							>
								‹
							</button>
						{/if}
						<div class="product-images-wrapper">
							{#each productImages as imageUrl, index}
								<img 
									src={imageUrl} 
									alt={product.name} 
									class="product-image"
									class:active={currentImageIndex === index}
									loading="eager"
								/>
							{/each}
						</div>
						{#if productImages.length > 1}
							<button 
								class="image-nav-button image-nav-next"
								onclick={() => productImageIndices[product.id] = (currentImageIndex + 1) % productImages.length}
								aria-label="Next image"
							>
								›
							</button>
						{/if}
					</div>
					<div class="product-details">
						<div class="product-line-1">
							<h2 class="product-name">{product.name}</h2>
							<p class="product-price">{product.price}</p>
						</div>
						<div class="product-line-2">
							<div class="sizes-text">
								{#each getSizes(product) as size}
									{@const inStock = isSizeInStock(product, size)}
									<span 
										class="size-text"
										class:selected={selectedSizes[product.id] === size}
										class:out-of-stock={!inStock}
										onclick={() => {
											if (inStock) {
												selectSize(product.id, size, product);
											}
										}}
										onkeydown={(e) => {
											if (e.key === 'Enter' && inStock) {
												selectSize(product.id, size, product);
											}
										}}
										role="button"
										tabindex={inStock ? 0 : -1}
										aria-disabled={!inStock}
									>
										{size}
									</span>
								{/each}
							</div>
							<button 
								class="add-to-cart-text"
								onclick={(e) => {
									e.preventDefault();
									e.stopPropagation();
									
									const selectedSize = selectedSizes[product.id];
									if (selectedSize && isSizeInStock(product, selectedSize)) {
										addToCart(product);
									}
								}}
								onkeydown={(e) => {
									if (e.key === 'Enter') {
										e.preventDefault();
										const selectedSize = selectedSizes[product.id];
										if (selectedSize && isSizeInStock(product, selectedSize)) {
											addToCart(product);
										}
									}
								}}
								disabled={!selectedSizes[product.id] || !isSizeInStock(product, selectedSizes[product.id])}
								type="button"
							>
								Add to Cart
							</button>
						</div>
						{#if product.description}
							{@const sections = parseDescription(product.description)}
							{#if sections.length > 1}
								<div class="product-description-sections">
									{#each sections as section}
										{#if section.title === 'Description'}
											<p class="product-description-intro">{section.content}</p>
										{/if}
									{/each}
									<div class="description-sections-container">
										<div class="description-section-headers">
											{#each sections as section}
												{#if section.title !== 'Description'}
													{@const isExpanded = isSectionExpanded(product.id, section.title)}
													<button
														class="description-section-header"
														class:active={isExpanded}
														onclick={() => toggleSection(product.id, section.title)}
														aria-expanded={isExpanded}
													>
														<span class="section-title">{section.title}</span>
													</button>
												{/if}
											{/each}
										</div>
										<div class="description-section-content-wrapper">
											{#each sections as section}
												{#if section.title !== 'Description'}
													{@const isExpanded = isSectionExpanded(product.id, section.title)}
													{#if isExpanded}
														<div class="description-section-content">
															{@html section.content.replace(/\n/g, '<br>')}
														</div>
													{/if}
												{/if}
											{/each}
										</div>
									</div>
								</div>
							{:else if sections.length === 1}
								<p class="product-description">{sections[0].content}</p>
							{:else}
								<p class="product-description">{product.description}</p>
							{/if}
						{/if}
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>

<style>
	.product-page {
		width: 100%;
		min-height: 100vh;
		padding: 2rem;
	}

	.loading,
	.no-products {
		text-align: center;
		padding: 4rem 2rem;
		font-family: Helvetica, Arial, sans-serif;
		font-size: 0.75rem;
		color: #666;
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

	.product-image-container {
		position: relative;
		width: 400px;
		flex-shrink: 0;
	}

	.product-image-container:hover .image-nav-button {
		opacity: 1;
	}

	.product-images-wrapper {
		position: relative;
		width: 100%;
	}

	.product-image {
		width: 100%;
		height: auto;
		display: block;
		object-fit: cover;
		position: absolute;
		top: 0;
		left: 0;
		opacity: 0;
		transition: opacity 0.3s ease;
	}

	.product-image.active {
		position: relative;
		opacity: 1;
	}

	.image-nav-button {
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		background: transparent;
		border: none;
		width: 40px;
		height: 40px;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		font-size: 32px;
		font-weight: normal;
		color: black;
		z-index: 10;
		opacity: 0;
		transition: opacity 0.2s ease;
	}

	.image-nav-prev {
		left: 10px;
	}

	.image-nav-next {
		right: 10px;
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
		-webkit-tap-highlight-color: transparent;
		touch-action: manipulation;
		user-select: none;
	}

	.size-text:hover:not(.out-of-stock) {
		opacity: 0.6;
	}

	.size-text.selected {
		text-decoration: underline;
		text-underline-offset: 0.2em;
		text-decoration-thickness: 1px;
	}

	.size-text.out-of-stock {
		color: #999;
		opacity: 0.5;
		cursor: not-allowed;
		text-decoration-color: #999;
		pointer-events: none;
	}

	.add-to-cart-text {
		font-family: Helvetica, Arial, sans-serif;
		font-size: 0.75rem;
		color: black;
		background: transparent;
		border: none;
		padding: 0;
		margin: 0;
		z-index: 10000;
		cursor: pointer;
		text-decoration: underline;
		transition: opacity 0.3s ease;
		-webkit-tap-highlight-color: transparent;
		touch-action: manipulation;
		user-select: none;
	}

	.add-to-cart-text:hover:not(:disabled) {
		opacity: 0.6;
	}

	.add-to-cart-text:disabled {
		opacity: 0.3;
		cursor: not-allowed;
		text-decoration: none;
		pointer-events: none;
	}

	.product-description {
		font-family: Helvetica, Arial, sans-serif;
		font-size: 0.75rem;
		line-height: 1.6;
		color: #000000;
		margin: 0;
		max-width: 75%;
	}

	.product-description-sections {
		display: flex;
		flex-direction: column;
		gap: 0;
		max-width: 75%;
	}

	.product-description-intro {
		font-family: Helvetica, Arial, sans-serif;
		font-size: 0.75rem;
		color: #000000;
		margin: 0 0 1rem 0;
		white-space: pre-wrap;
	}

	.description-sections-container {
		display: flex;
		flex-direction: column;
		gap: 0;
	}

	.description-section-headers {
		display: flex;
		flex-direction: row;
		gap: 2rem;
		align-items: baseline;
		padding-bottom: 0.5rem;
		margin-bottom: 1rem;
	}

	.description-section-header {
		background: transparent;
		border: none;
		cursor: pointer;
		font-family: Helvetica, Arial, sans-serif;
		font-size: 0.75rem;
		text-align: left;
		color: #000000;
		transition: opacity 0.2s ease;
		padding: 0;
		margin: 0;
	}

	.description-section-header:hover {
		opacity: 0.7;
	}

	.section-title {
		font-weight: normal;
		text-decoration: underline;
		text-underline-offset: 0.2em;
		text-decoration-thickness: 1px;
	}

	.description-section-header.active .section-title {
		text-decoration: underline;
	}

	.description-section-content-wrapper {
		min-height: 0;
	}

	.description-section-content {
		padding: 0 0 1rem 0;
		font-family: Helvetica, Arial, sans-serif;
		font-size: 0.75rem;
		line-height: 1.6;
		color: #000000;
		white-space: pre-wrap;
	}

	@media (max-width: 1024px) {
		.product-page {
			padding: 1rem;
		}

		.product-row {
			flex-direction: column;
			gap: 2rem;
		}

		.product-image-container {
			width: 100%;
		}

		.product-image {
			width: 100%;
		}

		.product-line-1 {
			justify-content: space-between;
		}

		.product-name {
			flex: 1;
		}

		.product-price {
			margin-left: auto;
		}

		.product-description-sections {
			max-width: 100%;
		}

		.product-description-intro {
			max-width: 100%;
		}

		.product-description {
			max-width: 100%;
		}
	}
</style>

