// Shopify Storefront API client
// This file handles communication with Shopify's Storefront API

import { env } from '$env/dynamic/public';

const SHOPIFY_STORE_DOMAIN = env.PUBLIC_SHOPIFY_STORE_DOMAIN || '';
const SHOPIFY_STOREFRONT_ACCESS_TOKEN = env.PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN || '';

export interface ShopifyProduct {
	id: string;
	title: string;
	handle: string;
	description: string;
	images: {
		edges: Array<{
			node: {
				url: string;
				altText: string | null;
			};
		}>;
	};
	variants: {
		edges: Array<{
			node: {
				id: string;
				title: string;
				price: {
					amount: string;
					currencyCode: string;
				};
				availableForSale: boolean;
				selectedOptions: Array<{
					name: string;
					value: string;
				}>;
			};
		}>;
	};
	options: Array<{
		name: string;
		values: string[];
	}>;
	metafields?: Array<{
		namespace: string;
		key: string;
		value: string;
		reference?: {
			image?: {
				url: string;
				altText: string | null;
			};
		};
	}>;
}

export interface ShopifyProductResponse {
	data?: {
		products?: {
			edges: Array<{
				node: ShopifyProduct;
			}>;
		};
		productListings?: {
			edges: Array<{
				node: ShopifyProduct;
			}>;
		};
	};
	errors?: Array<{
		message: string;
		locations?: Array<{
			line: number;
			column: number;
		}>;
	}>;
}

// GraphQL query to fetch all products using products (for unauthenticated_read_products scope)
const PRODUCTS_QUERY = `
	query getProducts {
		products(first: 250) {
			edges {
				node {
					id
					title
					handle
					description
					images(first: 10) {
						edges {
							node {
								url
								altText
							}
						}
					}
					variants(first: 100) {
						edges {
							node {
								id
								title
								price {
									amount
									currencyCode
								}
								availableForSale
								selectedOptions {
									name
									value
								}
							}
						}
					}
					options {
						name
						values
					}
					metafields(identifiers: [
						{ namespace: "custom", key: "size_chart" },
						{ namespace: "custom", key: "sizechart" },
						{ namespace: "custom", key: "size-chart" },
						{ namespace: "global", key: "size_chart" },
						{ namespace: "global", key: "sizechart" },
						{ namespace: "global", key: "size-chart" }
					]) {
						namespace
						key
						value
						reference {
							... on MediaImage {
								image {
									url
									altText
								}
							}
						}
					}
				}
			}
		}
	}
`;

export async function fetchProductsFromShopify(): Promise<ShopifyProduct[]> {
	if (!SHOPIFY_STORE_DOMAIN || !SHOPIFY_STOREFRONT_ACCESS_TOKEN) {
		console.warn('Shopify credentials not configured.');
		console.warn('SHOPIFY_STORE_DOMAIN:', SHOPIFY_STORE_DOMAIN ? 'set' : 'missing');
		console.warn('SHOPIFY_STOREFRONT_ACCESS_TOKEN:', SHOPIFY_STOREFRONT_ACCESS_TOKEN ? 'set' : 'missing');
		throw new Error('Shopify credentials not configured. Please set PUBLIC_SHOPIFY_STORE_DOMAIN and PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN environment variables.');
	}

	// Validate store domain format
	let storeDomain = SHOPIFY_STORE_DOMAIN.trim();
	// Remove https:// if present
	storeDomain = storeDomain.replace(/^https?:\/\//, '');
	// Remove trailing slash
	storeDomain = storeDomain.replace(/\/$/, '');
	
	// Check if domain looks valid (should be something.myshopify.com or a custom domain)
	if (!storeDomain.includes('.')) {
		throw new Error(`Invalid Shopify store domain format: "${storeDomain}". Should be like "yourstore.myshopify.com" or your custom domain.`);
	}

	try {
		// Try latest API version first, fallback to older versions if needed
		const queryApiVersions = ['2024-07', '2024-04', '2024-01', '2023-10'];
		let lastError: Error | null = null;
		
		for (const apiVersion of queryApiVersions) {
			const url = `https://${storeDomain}/api/${apiVersion}/graphql.json`;
			
			const response = await fetch(url, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_ACCESS_TOKEN
				},
				body: JSON.stringify({ query: PRODUCTS_QUERY })
			});

			// Check content type before parsing
			const contentType = response.headers.get('content-type') || '';
			if (!contentType.includes('application/json')) {
				// Response is not JSON, likely an HTML error page
				const textResponse = await response.text();
				console.error(`API version ${apiVersion} returned non-JSON response (${contentType})`);
				console.error('Response preview:', textResponse.substring(0, 500));
				
				// Check if it's an HTML error page
				if (textResponse.trim().toLowerCase().startsWith('<!doctype') || textResponse.trim().toLowerCase().startsWith('<html')) {
					lastError = new Error(`Shopify API returned HTML error page. This usually means: 1) Invalid store domain (${storeDomain}), 2) Invalid API version, or 3) Invalid credentials. Status: ${response.status}. Make sure your store domain is in the format "yourstore.myshopify.com" (without https://).`);
				} else {
					lastError = new Error(`Shopify API returned unexpected content type: ${contentType}. Status: ${response.status}`);
				}
				continue;
			}

			const responseData = await response.json();
			
			if (!response.ok || responseData.errors) {
				console.error(`API version ${apiVersion} failed:`, response.status, response.statusText);
				console.error('Response body:', JSON.stringify(responseData, null, 2));
				
				// Check for specific error types
				if (responseData.errors) {
					const errorMessages = responseData.errors.map((e: any) => e.message).join(', ');
					lastError = new Error(`Shopify API error (${apiVersion}): ${errorMessages}`);
				} else {
					lastError = new Error(`Shopify API error (${apiVersion}): ${response.status} ${response.statusText}`);
				}
				// Try next version
				continue;
			}
			
			// Success! Parse the response
			const data: ShopifyProductResponse = responseData;
			
			// Use products query (productListings doesn't exist in this API version)
			const productsData = data.data?.products;
			
			if (productsData?.edges) {
				const products = productsData.edges.map(edge => edge.node);
				return products;
			}
			
			console.warn('No products found in Shopify response');
			console.warn('Response data:', JSON.stringify(data.data, null, 2));
			return [];
		}
		
		// All versions failed
		if (lastError) {
			throw lastError;
		}
		throw new Error('All API versions failed');
	} catch (error) {
		console.error('Error fetching products from Shopify:', error);
		if (error instanceof Error) {
			console.error('Error message:', error.message);
			// Re-throw credential errors so they can be handled properly
			if (error.message.includes('credentials not configured')) {
				throw error;
			}
		}
		// For other errors, return empty array (API failures, etc.)
		return [];
	}
}

// Helper function to format price without decimals
function formatPrice(price: string): string {
	const num = parseFloat(price);
	if (isNaN(num)) return price;
	return Math.round(num).toString();
}

// Convert Shopify product to our Product format
export function convertShopifyProduct(shopifyProduct: ShopifyProduct) {
	// Get all images
	const allImages = shopifyProduct.images.edges.map(edge => edge.node.url).filter(Boolean);
	const firstImage = allImages[0] || '';
	const firstVariant = shopifyProduct.variants.edges[0]?.node;
	const price = formatPrice(firstVariant?.price?.amount || '0');
	
	// Extract size options if available
	const sizeOption = shopifyProduct.options.find(opt => 
		opt.name.toLowerCase() === 'size' || opt.name.toLowerCase() === 'sizes'
	);
	const sizes = sizeOption?.values || [];

	// Convert variants to our format
	// Use full GID for checkout (Shopify requires full GID format)
	const variants = shopifyProduct.variants.edges.map(edge => ({
		id: edge.node.id, // Full GID for checkout: "gid://shopify/ProductVariant/123456789"
		shortId: edge.node.id.split('/').pop() || edge.node.id, // Short ID for display
		title: edge.node.title,
		price: edge.node.price,
		availableForSale: edge.node.availableForSale,
		selectedOptions: edge.node.selectedOptions
	}));

	// Extract size chart from metafields
	// Common metafield keys: 'size_chart', 'sizechart', 'size-chart'
	let sizeChart: string | undefined;
	if (shopifyProduct.metafields && shopifyProduct.metafields.length > 0) {
		for (const metafield of shopifyProduct.metafields) {
			// Skip null metafields (they don't exist)
			if (!metafield || !metafield.key || !metafield.namespace) {
				continue;
			}
			
			const key = metafield.key.toLowerCase();
			const namespace = metafield.namespace.toLowerCase();
			
			// Check for size chart in various formats
			if (
				(key.includes('size') && key.includes('chart')) ||
				(namespace.includes('size') && namespace.includes('chart')) ||
				key === 'size_chart' || key === 'sizechart' || key === 'size-chart'
			) {
				// If it's a media image reference, get the image URL
				if (metafield.reference?.image?.url) {
					sizeChart = `<img src="${metafield.reference.image.url}" alt="${metafield.reference.image.altText || 'Size chart'}" style="max-width: 100%; height: auto;" />`;
				} else if (metafield.value) {
					// Otherwise use the value directly (could be HTML or text)
					sizeChart = metafield.value;
				}
				break;
			}
		}
	}

	return {
		id: shopifyProduct.id.split('/').pop() || shopifyProduct.id,
		shopifyId: shopifyProduct.id,
		name: shopifyProduct.title,
		price: price,
		image: firstImage, // For backward compatibility
		images: allImages, // All images for scrolling
		description: shopifyProduct.description || '',
		slug: shopifyProduct.handle,
		variants: variants,
		sizes: sizes,
		sizeChart: sizeChart
	};
}

