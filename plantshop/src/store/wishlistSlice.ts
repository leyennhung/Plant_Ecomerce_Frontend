import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { WishlistState } from '../types/wishlist.type';
import type { RootState } from './index';

const initialState: WishlistState = {
    productIds: [],
    isLoading: false,
    error: null,
};

const wishlistSlice = createSlice({
    name: 'wishlist',
    initialState,
    reducers: {
        fetchWishlistStart: (state) => {
            state.isLoading = true;
            state.error = null;
        },
        fetchWishlistSuccess: (state, action: PayloadAction<number[]>) => {
            state.isLoading = false;
            state.productIds = action.payload;
        },
        fetchWishlistFailure: (state, action: PayloadAction<string>) => {
            state.isLoading = false;
            state.error = action.payload;
        },
        removeFromWishlist: (state, action: PayloadAction<number>) => {
            state.productIds = state.productIds.filter(
                id => id !== action.payload
            );
        },
    },
});

export const {
    fetchWishlistStart,
    fetchWishlistSuccess,
    fetchWishlistFailure,
    removeFromWishlist,
} = wishlistSlice.actions;

export default wishlistSlice.reducer;

export const selectIsProductInWishlist =
    (productId: number) => (state: RootState) =>
        state.wishlist.productIds.includes(productId);
