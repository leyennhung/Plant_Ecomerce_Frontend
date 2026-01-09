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
        },

        // Thêm sản phẩm vào cart
        addToCart: (state, action: PayloadAction<CartViewItem>) => {
            // Kiểm tra sản phẩm đã tồn tại trong cart chưa
            const existing = state.items.find(
                item => item.productId === action.payload.productId
            );

            // Nếu đã tồn tại, cộng thêm số lượng
            if (existing) {
                existing.quantity += action.payload.quantity;
            } else {
                // Nếu chưa tồn tại, thêm mới
                state.items.push(action.payload);
            }
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

export const {
    setCartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
