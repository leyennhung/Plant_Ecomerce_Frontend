export interface WishlistItem {
    id: number;
    user_id: number;
    product_id: number;
    created_at: string;
}

export interface WishlistResponse {
    wishlist: WishlistItem[];
}
export interface WishlistState {
    productIds: number[];
    isLoading: boolean;
    error: string | null;
}