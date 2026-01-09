import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cartSlice";
import wishlistReducer from "./wishlistSlice";

// load cart từ localStorage khi app start
const loadCart = () => {
    const data = localStorage.getItem("cart_items");
    return data ? JSON.parse(data) : [];
};

export const store = configureStore({
    reducer: {
        cart: cartReducer,
        wishlist: wishlistReducer,
    },
    preloadedState: {
        cart: {
            items: loadCart(),
        },
    },
});

// mỗi lần redux thay đổi -> lưu cart lại
store.subscribe(() => {
    const state = store.getState();
    localStorage.setItem(
        "cart_items",
        JSON.stringify(state.cart.items)
    );
});

// typescript helpers
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
