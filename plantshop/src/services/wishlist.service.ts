import { api } from './api';
import type { WishlistResponse } from '../types/wishlist.type';

// Lấy danh sách wishlist
export const getWishlist = async (): Promise<WishlistResponse> => {
    // Gọi API lấy wishlist
    const res = await api.get('/wishlist');
    return res.data;
};

// Xóa sản phẩm khỏi wishlist theo productId
export const removeProductFromWishlist = async (productId: number) => {
    // Gọi API delete wishlist (mock)
    return api.delete(`/wishlist/${productId}`);
};

