import type { WishlistItem } from "../types/wishlist.type";

export const mergeWishlistItems = (
    guest: WishlistItem[],
    user: WishlistItem[],
    userId: number
): WishlistItem[] => {
    const merged = [...user];

    guest.forEach(item => {
        const exists = merged.some(i => i.product_id === item.product_id);
        if (!exists) {
            merged.push({
                ...item,
                id: Date.now() + Math.random(),
                user_id: userId,
            });
        }
    });

    return merged;
};
