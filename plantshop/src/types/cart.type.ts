export interface Cart {
    id: number;
    user_id: number | null;
    session_id: string | null;
    status: "active" | "converted";
    created_at: string;
    updated_at: string;
}

export interface CartItemEntity {
    id: number;
    order_id: string;
    product_id: number;
    quantity: number;
    price: number;            // giá đã áp sale
    original_price?: number;  // giá gốc (optional)
    created_at: string;
    updated_at: string;
}

export interface CartResponse {
    carts: Cart[];
}

export interface CartItemResponse {
    cart_items: CartItemEntity[];
}

export interface CartViewItem {
    id: number;
    productId: number;
    name: string;
    image: string;
    price: number;            // giá đã áp sale
    original_price?: number;  // giá gốc (optional)
    quantity: number;
}
