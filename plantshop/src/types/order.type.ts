export type OrderStatus =
    | "pending"
    | "confirmed"
    | "packing"
    | "shipping"
    | "done"
    | "paid"
    | "success"
    | "cancelled"
    | "failed"

// Định nghĩa thông tin sản phẩm snapshot
export type ProductSnapshot = {
    name: string;
    imageUrl?: string;
};

export type OrderItem = {
    id: number;
    order_id?: string;
    product_id: number;
    quantity: number;
    price: number;

    // Các trường snapshot từ Cart để hiển thị
    name?: string;
    imageUrl?: string;
    productInfo?: ProductSnapshot;
};

export type Order = {
    id: string;
    user_id: number | null;
    recipient_name: string;
    recipient_phone: string;
    full_address: string;
    payment_method_id: number;
    payment_status: string;
    subtotal: number;
    shipping_fee: number;
    discount_amount: number;
    total_amount: number;
    status: OrderStatus;
    created_at: string;

    // Mảng items lưu nested trong localStorage
    items?: OrderItem[];
    itemsDetail?: OrderItem[];

    note?: string;
    payment_method?: string;
};
export type OrderCreatePayload = {
    user_id: number | null;
    recipient_name: string;
    recipient_phone: string;
    full_address: string;
    payment_method_id: number;
    payment_status: string;
    subtotal: number;
    shipping_fee: number;
    discount_amount: number;
    total_amount: number;
};
