export interface Product {
	id: string;
	shopifyId?: string;
	name: string;
	price: string;
	image: string;
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
}

export const products: Product[] = [
	{
		id: '1',
		name: 'Bella Skirt',
		price: '90',
		image: '/BellaSkirt.png',
		description: 'Handmade lace mini skirts designed as beach coverups, re-worked from recycled vintage lace.',
		slug: 'bella-skirt'
	},
	{
		id: '2',
		name: 'Lace Headband',
		price: "25",
		image: '/LaceHeadband.png',
		description: 'Delicate lace headband for an elegant touch',
		slug: 'lace-headband'
	},
	{
		id: '3',
		name: 'Perla Dress',
		price: "150",
		image: '/PerlaDress.png',
		description: 'The Pearla Dress is a halter-style mini dress made from a lightweight blend of 55% linen and 45% cotton. It features a low, open back and a single mother-of-pearl button detail at the neck.',
		slug: 'perla-dress'
	}
];
