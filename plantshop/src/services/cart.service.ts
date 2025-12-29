import { api } from "./api";
import type {
    CartItemEntity,
    CartItemResponse,
    CartViewItem,
} from "../types/cart.type";
import type { Product } from "../types/product.type";

export const cartService = {
    async getAll(): Promise<CartViewItem[]> {
        const cartRes = await api.get<CartItemResponse>("/cart_items");
        const productRes = await api.get<Product[]>("/products");

        return cartRes.data.cart_items.map((item: CartItemEntity) => {
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
