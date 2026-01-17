import type { CartViewItem } from "../types/cart.type";

export function mergeCartItems(
    guestItems: CartViewItem[],
    userItems: CartViewItem[]
): CartViewItem[] {
    const map = new Map<number, CartViewItem>();

    // Add user items trước
    userItems.forEach(item => {
        map.set(item.productId, { ...item });
    });

    // Merge guest items
    guestItems.forEach(item => {
        const existed = map.get(item.productId);
        if (existed) {
            existed.quantity += item.quantity;
        } else {
            map.set(item.productId, { ...item });
        }
    });

    return Array.from(map.values());
}
