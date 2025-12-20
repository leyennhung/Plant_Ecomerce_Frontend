import { api } from "./api";
import type { CartItem } from "../types/cart.type";

export const cartService = {
    getAll(): Promise<CartItem[]> {
        return api.get("/cart").then(res => res.data);
    }
};
