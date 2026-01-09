import { api } from "./api";
import type {
    CartItemResponse,
    CartViewItem,
} from "../types/cart.type";
import type { Product } from "../types/product.type";
import type {CartResponse} from "../types/cart.type";
import { getCurrentUser, getSessionId } from "../utils/auth";

export const cartService = {
    // Lấy cart đang active của user hoặc guest
    async getActiveCart() {
        const user = getCurrentUser();
        const sessionId = getSessionId();

        // Tạo params theo user hoặc guest
        const params = user
            ? { user_id: user.id, status: "active" }
            : { session_id: sessionId, status: "active" };

        // Gọi API lấy danh sách cart
        const res = await api.get<CartResponse>("/carts", { params });
        // Lấy cart active đầu tiên
        return res.data.carts[0] ?? null;
    },
    // Lấy cart items và join với product để hiển thị
    async getCartItems(cartId: number): Promise<CartViewItem[]> {
        // Gọi song song API cart_items và products
        const [itemsRes, productRes] = await Promise.all([
            api.get<CartItemResponse>("/cart_items", {
                params: { cart_id: cartId },
            }),
            api.get<Product[]>("/products"),
        ]);

        // Join cart_items với product
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

    // Cập nhật số lượng sản phẩm trong cart
    async updateQuantity(itemId: number, quantity: number) {
        await api.patch(`/cart_items/${itemId}`, { quantity });
    },

    // thêm sản phẩm vào giỏ hàng
    async addToCart(productId: number, price: number, stock?: number) {
        // Kiểm tra tồn kho (nếu có)
        if (stock !== undefined && stock <= 0) {
            throw new Error("Sản phẩm đã hết hàng");
        }

        const user = getCurrentUser();
        const sessionId = getSessionId();

        // Lấy cart active hiện tại
        let cart = await this.getActiveCart();

        // Nếu chưa có cart -> tạo cart mới
        if (!cart) {
            const res = await api.post("/carts", {
                user_id: user?.id ?? null, // cart của user
                session_id: user ? null : sessionId, // cart của guest
                status: "active",
            });
            cart = res.data;
        }

        // Thêm sản phẩm vào cart
        await api.post("/cart_items", {
            cart_id: cart.id,
            product_id: productId,
            price,
            quantity: 1,
        });
    },
};

