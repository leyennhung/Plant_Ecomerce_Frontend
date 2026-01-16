import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { CartViewItem } from "../types/cart.type";
import { getFinalPrice } from "../utils/getFinalPrice";
import products from "../mocks/data/products.json";
import type { ProductApi } from "../types/product-api.type";

const productList = products.products as ProductApi[];

interface VariantPayload {
    id: number;
    name: string;
    price: number;
    image?: string;
}

interface AddToCartPayload {
    productId: number;
    quantity: number;
    variant?: VariantPayload;
}

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
            localStorage.setItem(getCartStorageKey(), JSON.stringify(state.items));
        },

        addToCart: (state, action: PayloadAction<AddToCartPayload>) => {
            const { productId, quantity, variant } = action.payload;

            const product = productList.find(p => p.id === productId);
            if (!product) return;

            const result = getFinalPrice(product, quantity);
            const basePrice = variant?.price ?? result.price;

            const existing = state.items.find(
                item =>
                    item.productId === productId &&
                    (variant ? item.variantId === variant.id : !item.variantId)
            );

            if (existing) {
                existing.quantity += quantity;

                const updated = getFinalPrice(product, existing.quantity);

                if (!variant) {
                    existing.price = updated.price;
                }

                existing.isWholesale = updated.isWholesale;
                existing.wholesaleMin = updated.wholesaleMin;
            } else {
                state.items.push({
                    id: Date.now(),
                    productId,
                    name: variant ? `${product.name} (${variant.name})` : product.name,
                    image:
                        variant?.image ||
                        product.images?.[0]?.url ||
                        product.image ||
                        "",
                    price: basePrice,
                    original_price: product.price,
                    quantity,
                    isWholesale: result.isWholesale,
                    wholesaleMin: result.wholesaleMin,
                    variantId: variant?.id,
                    variantName: variant?.name,
                });
            }

            localStorage.setItem(getCartStorageKey(), JSON.stringify(state.items));
        },

        removeFromCart: (
            state,
            action: PayloadAction<{ productId: number; variantId?: number }>
        ) => {
            state.items = state.items.filter(
                i =>
                    !(
                        i.productId === action.payload.productId &&
                        i.variantId === action.payload.variantId
                    )
            );
            localStorage.setItem(getCartStorageKey(), JSON.stringify(state.items));
        },

        updateQuantity: (
            state,
            action: PayloadAction<{
                productId: number;
                quantity: number;
                variantId?: number;
            }>
        ) => {
            const { productId, quantity, variantId } = action.payload;

            const item = state.items.find(
                i => i.productId === productId && i.variantId === variantId
            );
            if (!item) return;

            item.quantity = quantity;

            const product = productList.find(p => p.id === productId);
            if (!product) return;

            const updated = getFinalPrice(product, quantity);

            if (!item.variantId) {
                item.price = updated.price;
            }

            item.isWholesale = updated.isWholesale;
            item.wholesaleMin = updated.wholesaleMin;

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
