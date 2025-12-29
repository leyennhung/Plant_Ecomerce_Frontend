import { http, HttpResponse } from "msw";
import carts from "../data/carts.json";
import cartItems from "../data/cart_items.json";

export const cartHandlers = [
    http.get("/plant/carts", () => {
        return HttpResponse.json(carts);
    }),

    http.get("/plant/cart_items", () => {
        return HttpResponse.json(cartItems);
    }),
];
