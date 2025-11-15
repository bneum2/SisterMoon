export interface Product {
	id: string;
	shopifyId?: string;
	name: string;
	price: string;
	image: string; // First image for backward compatibility
	images?: string[]; // All images
	description: string;
	slug: string;
	variants?: Array<{
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
	}>;
	sizes?: string[];
	sizeChart?: string; // Size chart metafield content
}
