import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { WishlistItem } from "../types/wishlist.type";
import type { RootState } from "./index";


type WishlistState = {
    items: WishlistItem[];
};

const initialState: WishlistState = {
    items: [],
};

const wishlistSlice = createSlice({
    name: "wishlist",
    initialState,
    reducers: {
        setWishlist(state, action: PayloadAction<WishlistItem[]>) {
            state.items = action.payload;
        },

        addToWishlist(state, action: PayloadAction<WishlistItem>) {
            const exists = state.items.some(
                i => i.product_id === action.payload.product_id
            );
            if (!exists) {
                state.items.push(action.payload);
            }
        },

        removeFromWishlist(state, action: PayloadAction<number>) {
            state.items = state.items.filter(
                i => i.product_id !== action.payload
            );
        },
    },
});

export const {
    setWishlist,
    addToWishlist,
    removeFromWishlist,
} = wishlistSlice.actions;

export default wishlistSlice.reducer;

export const selectWishlistItems = (state: RootState) =>
    state.wishlist.items;

export const selectIsInWishlist =
    (productId: number) => (state: RootState) =>
        state.wishlist.items.some(i => i.product_id === productId);
