import type { Order } from "../types/order.type";
import { nanoid } from "nanoid";

/**
 * Lưu đơn hàng vào localStorage
 * - Tự động sinh id cho order bằng nanoid
 * - Lưu order mới lên đầu danh sách (mới nhất trước)
 */
export const saveOrder = (order: Omit<Order, "id">) => {
    // Lấy danh sách đơn hàng hiện có từ localStorage
    // Nếu chưa có thì mặc định là mảng rỗng
    const orders: Order[] = JSON.parse(
        localStorage.getItem("orders") || "[]"
    );

    // Tạo đơn hàng mới với id tự sinh
    const newOrder: Order = {
        ...order,
        id: nanoid(),
    };

    // Lưu lại danh sách đơn hàng
    // Order mới được thêm lên đầu mảng
    localStorage.setItem(
        "orders",
        JSON.stringify([newOrder, ...orders])
    );
};

