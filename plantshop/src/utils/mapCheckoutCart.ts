import type { CartViewItem } from "../types/cart.type";
import type { CheckoutCartItem } from "../types/checkout.type";
import productsData from "../mocks/data/products.json";

// Parse trọng lượng từ chuỗi (vd: "1.5kg", "500g", "2")
// Nếu không có hoặc parse thất bại -> mặc định 1kg
function parseWeightKg(raw?: string): number {
    // Không có dữ liệu -> mặc định 1kg
    if (!raw) return 1;

    // Lấy phần số trong chuỗi
    const match = raw.match(/([\d.]+)/);

    // Nếu match được -> convert sang number, ngược lại mặc định 1kg
    return match ? Number(match[1]) : 1;
}

// Map cart item sang checkout cart item
// Bổ sung thêm weightKg để tính phí vận chuyển
export function mapToCheckoutCart(
    cartItems: CartViewItem[]
): CheckoutCartItem[] {
    return cartItems.map((item) => {
        // Tìm thông tin sản phẩm theo productId
        const product = productsData.products.find(
            (p) => p.id === item.productId
        );

        return {
            // Giữ nguyên các field cũ của cart item
            ...item,

            // Gắn thêm trọng lượng (kg) cho mỗi item
            weightKg: parseWeightKg(product?.dimensions?.weight?? undefined),
        };
    });
}
