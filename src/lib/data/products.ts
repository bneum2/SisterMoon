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
		description: 'Stunning pearl-inspired dress for special moments',
		slug: 'perla-dress'
	}
];
