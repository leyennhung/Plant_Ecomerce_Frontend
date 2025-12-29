import { api } from './api';
import type { WishlistResponse } from '../types/wishlist.type';

export const getWishlist = async (): Promise<WishlistResponse> => {
    const res = await api.get('/wishlist');
    return res.data;
};

export const removeProductFromWishlist = async (productId: number) => {
    return api.delete(`/wishlist/${productId}`);
};
