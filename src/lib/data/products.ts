export interface Product {
	id: string;
	name: string;
	price: string;
	image: string;
	description: string;
	slug: string;
}

export const products: Product[] = [
	{
		id: '1',
		name: 'Bella Skirt',
		price: '90 USD',
		image: '/BellaSkirt.png',
		description: 'A beautiful flowing skirt perfect for any occasion',
		slug: 'bella-skirt'
	},
	{
		id: '2',
		name: 'Lace Headband',
		price: "25 USD",
		image: '/LaceHeadband.png',
		description: 'Delicate lace headband for an elegant touch',
		slug: 'lace-headband'
	},
	{
		id: '3',
		name: 'Perla Dress',
		price: "150 USD",
		image: '/PerlaDress.png',
		description: 'Stunning pearl-inspired dress for special moments',
		slug: 'perla-dress'
	}
];
