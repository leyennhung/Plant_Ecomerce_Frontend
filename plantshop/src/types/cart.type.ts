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
    cart_id: number;
    product_id: number;
    quantity: number;
    price: number;
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
    price: number;
    quantity: number;
}
