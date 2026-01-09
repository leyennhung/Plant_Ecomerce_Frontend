import type { CartViewItem } from "./cart.type";

export interface CheckoutCartItem extends CartViewItem {
    weightKg: number; // weight chuẩn hóa sẵn (kg)
}
