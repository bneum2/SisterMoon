import { writable, derived, get } from 'svelte/store';

export interface CartItem {
	id: string;
	productId: string;
	variantId?: string; // Shopify variant ID for checkout
	name: string;
	price: string;
	image: string;
	size?: string;
	quantity: number;
}

// Create a writable store for cart items
const itemsStore = writable<CartItem[]>([]);

class CartStore {
	get items() {
		return get(itemsStore);
	}

	getItems() {
		return this.items;
	}

	addItem(productId: string, name: string, price: string, image: string, size?: string, variantId?: string) {
		itemsStore.update(items => {
			const existingItem = items.find(
				item => item.productId === productId && item.size === size
			);

			if (existingItem) {
				existingItem.quantity += 1;
				return [...items];
			} else {
				return [...items, {
					id: `${productId}-${size || 'default'}-${Date.now()}`,
					productId,
					variantId,
					name,
					price,
					image,
					size,
					quantity: 1
				}];
			}
		});
	}

	removeItem(itemId: string) {
		itemsStore.update(items => items.filter(item => item.id !== itemId));
	}

	updateQuantity(itemId: string, quantity: number) {
		itemsStore.update(items => {
			const item = items.find(item => item.id === itemId);
			if (item) {
				if (quantity <= 0) {
					return items.filter(item => item.id !== itemId);
				} else {
					item.quantity = quantity;
					return [...items];
				}
			}
			return items;
		});
	}

	getTotal() {
		return this.items.reduce((total, item) => {
			const price = parseFloat(item.price.replace(' USD', '').replace('$', ''));
			return total + (price * item.quantity);
		}, 0);
	}

	getItemCount() {
		return this.items.reduce((count, item) => count + item.quantity, 0);
	}

	clear() {
		itemsStore.set([]);
	}
}

// Export the store instance and the items store for reactivity
export const cart = new CartStore();
export const cartItems = itemsStore;

// Derived stores for common use cases
export const cartTotal = derived(itemsStore, $items => {
	return $items.reduce((total, item) => {
		const price = parseFloat(item.price.replace(' USD', '').replace('$', ''));
		return total + (price * item.quantity);
	}, 0);
});

export const cartItemCount = derived(itemsStore, $items => {
	return $items.reduce((count, item) => count + item.quantity, 0);
});

