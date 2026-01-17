export interface WishlistItem {
    id: number;
    user_id: number | null;
    product_id: number;
    variant_id?: number;
    name: string;
    image: string;
    price: number;
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