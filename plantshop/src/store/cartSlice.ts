import {createSlice, type PayloadAction} from "@reduxjs/toolkit";
import type {CartViewItem} from "../types/cart.type";
import {getFinalPrice} from "../utils/getFinalPrice";
import products from "../mocks/data/products.json";
import type {ProductApi} from "../types/product-api.type";

//ds product dùng để lấy thông tin product khi add vào cart
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
        // Set toàn bộ cart (dùng khi load cart từ localStorage lên Redux)
        setCartItems: (state, action: PayloadAction<CartViewItem[]>) => {
            state.items = action.payload;
            localStorage.setItem(getCartStorageKey(), JSON.stringify(state.items));
        },

        // addTocart product thường, pot(có variant, combo)
        addToCart: (state, action: PayloadAction<AddToCartPayload>) => {
            const {productId, quantity, variant} = action.payload;

            // Tìm product tương ứng theo id
            const product = productList.find(p => p.id === productId);
            if (!product) return;

            // Pot bắt buộc phải chọn variant (chậu size, màu, ...)
            if (product.type === "pot" && !variant) {
                return;
            }

            // COMBO
            if (product.type === "combo") {
                const existing = state.items.find(i => i.productId === productId);

                if (existing) {
                    existing.quantity += quantity;
                } else {
                    // Nếu chưa có → push item mới
                    state.items.push({
                        id: Date.now(),
                        productId,
                        name: product.name,
                        image: product.images?.[0]?.url || product.image || "",
                        price: product.salePrice ?? product.price,
                        original_price: product.price,
                        quantity,
                        // Lưu danh sách item con trong combo
                        comboItems:
                            product.comboItems?.map(ci => ({
                                productId: ci.id,
                                name: ci.name,
                                image: ci.image,
                                quantity: ci.quantity,
                            })) || [],
                    });
                }

                localStorage.setItem(getCartStorageKey(), JSON.stringify(state.items));
                return;
            }

            // PRODUCT THƯỜNG
            const result = getFinalPrice(product, quantity);//tính giá dựa trên salePrice,wholsale(mua sỉ)

            // Nếu có variant (pot) thì lấy giá từ variant
            // Nếu không thì lấy giá đã tính từ getFinalPrice
            const basePrice = variant ? variant.price : result.price;

            const existing = state.items.find(
                i =>
                    i.productId === productId &&
                    (variant ? i.variantId === variant.id : i.variantId == null)
            );

            if (existing) {
                existing.quantity += quantity;

                const updated = getFinalPrice(product, existing.quantity);

                if (!variant) {
                    existing.price = updated.price;
                }
// Update trạng thái wholesale
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
            const {productId, quantity, variantId} = action.payload;

            const item = state.items.find(
                i => i.productId === productId && i.variantId === variantId
            );
            if (!item) return;

            // Update quantity
            item.quantity = quantity;

            // Lấy product gốc để tính lại giá
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
        const {user} = JSON.parse(stored);
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
