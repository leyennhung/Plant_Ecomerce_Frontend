import { api } from "./api";
import type {
    CartItemResponse,
    CartViewItem,
} from "../types/cart.type";
import type { Product } from "../types/product.type";
import type {CartResponse} from "../types/cart.type";
import { getCurrentUser, getSessionId } from "../utils/auth";

export const cartService = {
    // Lấy cart active của user / guest
    async getActiveCart() {
        const user = getCurrentUser();
        const sessionId = getSessionId();

        const params = user
            ? { user_id: user.id, status: "active" }
            : { session_id: sessionId, status: "active" };

        const res = await api.get<CartResponse>("/carts", { params });
        return res.data.carts[0] ?? null;
    },
    // Lấy cart items + join product
    async getCartItems(cartId: number): Promise<CartViewItem[]> {
        const [itemsRes, productRes] = await Promise.all([
            api.get<CartItemResponse>("/cart_items", {
                params: { cart_id: cartId },
            }),
            api.get<Product[]>("/products"),
        ]);

        return itemsRes.data.cart_items.map(item => {
            const product = productRes.data.find(
                p => p.id === item.product_id
            );

            return {
                id: item.id,
                productId: item.product_id,
                name: product?.name ?? "",
                image: product?.image ?? "",
                price: item.price,
                quantity: item.quantity,
            };
        });
    },
};

