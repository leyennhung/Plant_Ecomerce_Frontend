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
        // Set toàn bộ danh sách cart items
        setCartItems: (state, action: PayloadAction<CartViewItem[]>) => {
            state.items = action.payload;
            localStorage.setItem(
                getCartStorageKey(),
                JSON.stringify(state.items)
            );
        },


        // Thêm sản phẩm vào cart
        addToCart: (state, action: PayloadAction<CartViewItem>) => {
            const existing = state.items.find(
                item => item.productId === action.payload.productId
            );

            if (existing) {
                existing.quantity += action.payload.quantity;
            } else {
                state.items.push(action.payload);
            }

            localStorage.setItem(
                getCartStorageKey(),
                JSON.stringify(state.items)
            );
        },

        // Xóa sản phẩm khỏi cart theo productId
        removeFromCart: (state, action: PayloadAction<number>) => {
            state.items = state.items.filter(
                item => item.productId !== action.payload
            );
        },

        // Cập nhật số lượng sản phẩm trong cart
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

        // Xóa toàn bộ cart
        clearCart: (state) => {
            state.items = [];
        },
    },
});
function getCartStorageKey() {
    const stored = localStorage.getItem("user");
    if (!stored) return "cart_guest";

    try {
        const { user } = JSON.parse(stored);
        return user?.id ? `cart_user_${user.id}` : "cart_guest";
    } catch {
        return "cart_guest";
    }
}

export const {
    setCartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
