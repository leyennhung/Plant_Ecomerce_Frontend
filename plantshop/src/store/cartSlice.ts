import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { CartViewItem } from "../types/cart.type";
import { getFinalPrice } from "../utils/getFinalPrice";
import products from "../mocks/data/products.json";
import type { ProductApi } from "../types/product-api.type";

const productList = products.products as ProductApi[];

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
            state.items = action.payload.map(item => {
                const product = productList.find(p => p.id === item.productId);
                if (!product) return item;

                const result = getFinalPrice(product, item.quantity);

                return {
                    ...item,
                    price: result.price,
                    original_price: product.price,
                    isWholesale: result.isWholesale,
                    wholesaleMin: result.wholesaleMin,
                };
            });

            localStorage.setItem(getCartStorageKey(), JSON.stringify(state.items));
        },

        addToCart: (
            state,
            action: PayloadAction<{ productId: number; quantity: number }>
        ) => {
            const product = productList.find(p => p.id === action.payload.productId);
            if (!product) return;

            const existing = state.items.find(i => i.productId === product.id);

            if (existing) {
                existing.quantity += action.payload.quantity;
                const result = getFinalPrice(product, existing.quantity);
                existing.price = result.price;
                existing.isWholesale = result.isWholesale;
                existing.wholesaleMin = result.wholesaleMin;
            } else {
                const result = getFinalPrice(product, action.payload.quantity);

                state.items.push({
                    id: Date.now(),
                    productId: product.id,
                    name: product.name,
                    image: product.images?.[0]?.url ?? product.image ?? "",
                    price: result.price,
                    original_price: product.price,
                    quantity: action.payload.quantity,
                    isWholesale: result.isWholesale,
                    wholesaleMin: result.wholesaleMin,
                });
            }

            localStorage.setItem(getCartStorageKey(), JSON.stringify(state.items));
        },

        removeFromCart: (state, action: PayloadAction<number>) => {
            state.items = state.items.filter(i => i.productId !== action.payload);
            localStorage.setItem(getCartStorageKey(), JSON.stringify(state.items));
        },

        updateQuantity: (
            state,
            action: PayloadAction<{ productId: number; quantity: number }>
        ) => {
            const item = state.items.find(i => i.productId === action.payload.productId);
            if (!item) return;

            item.quantity = action.payload.quantity;

            const product = productList.find(p => p.id === item.productId);
            if (product) {
                const result = getFinalPrice(product, item.quantity);
                item.price = result.price;
                item.isWholesale = result.isWholesale;
                item.wholesaleMin = result.wholesaleMin;
            }

            localStorage.setItem(getCartStorageKey(), JSON.stringify(state.items));
        },

        clearCart: state => {
            state.items = [];
            localStorage.setItem(getCartStorageKey(), JSON.stringify([]));
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
