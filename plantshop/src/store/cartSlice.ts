import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { CartViewItem } from "../types/cart.type";

interface CartState {
    items: CartViewItem[];
}

const initialState: CartState = {
    items: [],
};

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        setCartItems: (state, action: PayloadAction<CartViewItem[]>) => {
            state.items = action.payload;
        },

        addToCart: (state, action: PayloadAction<CartViewItem>) => {
            const existing = state.items.find(
                item => item.productId === action.payload.productId
            );

            if (existing) {
                existing.quantity += action.payload.quantity;
            } else {
                state.items.push(action.payload);
            }
        },

        removeFromCart: (state, action: PayloadAction<number>) => {
            state.items = state.items.filter(
                item => item.productId !== action.payload
            );
        },

        updateQuantity: (
            state,
            action: PayloadAction<{ productId: number; quantity: number }>
        ) => {
            const item = state.items.find(
                i => i.productId === action.payload.productId
            );
            if (item) {
                item.quantity = action.payload.quantity;
            }
        },

        clearCart: (state) => {
            state.items = [];
        },
    },
});

export const {
    setCartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
