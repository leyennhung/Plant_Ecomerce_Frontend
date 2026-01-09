export type OrderStatus =
    | "pending"
    | "confirmed"
    | "packing"
    | "shipping"
    | "done"
    | "paid";

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
};
