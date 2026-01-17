import {createSlice, type PayloadAction} from "@reduxjs/toolkit";
import type {WishlistItem} from "../types/wishlist.type";
import type {RootState} from "./index";

const STORAGE_KEY = "wishlist_items";

const loadFromStorage = (): WishlistItem[] => {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
};

const saveToStorage = (items: WishlistItem[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
};

type WishlistState = {
    items: WishlistItem[];
};

const initialState: WishlistState = {
    items: loadFromStorage(),
};

const wishlistSlice = createSlice({
    name: "wishlist",
    initialState,
    reducers: {
        setWishlist(state, action: PayloadAction<WishlistItem[]>) {
            state.items = action.payload;
            saveToStorage(state.items);
        },

        addToWishlist(state, action: PayloadAction<WishlistItem>) {
            const exists = state.items.some(
                i =>
                    i.product_id === action.payload.product_id &&
                    i.variant_id === action.payload.variant_id
            );
            if (!exists) {
                state.items.push(action.payload);
                saveToStorage(state.items);
            }
        },

        removeFromWishlist(
            state,
            action: PayloadAction<{ productId: number; variantId?: number }>
        ) {
            state.items = state.items.filter(
                i =>
                    !(
                        i.product_id === action.payload.productId &&
                        i.variant_id === action.payload.variantId
                    )
            );
            saveToStorage(state.items);
        },
    },
});

export const {setWishlist, addToWishlist, removeFromWishlist} =
    wishlistSlice.actions;

export default wishlistSlice.reducer;

export const selectWishlistItems = (state: RootState) =>
    state.wishlist.items;

export const selectIsInWishlist =
    (productId: number, variantId?: number) => (state: RootState) =>
        state.wishlist.items.some(
            i => i.product_id === productId && i.variant_id === variantId
        );
