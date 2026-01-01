import data from "../data/cart_items.json";
import { http, HttpResponse } from "msw";

export const cartItemHandlers = [
    // lọc theo cart_id
    http.get("/plant/cart_items", ({ request }) => {
        const url = new URL(request.url);
        const cartId = Number(url.searchParams.get("cart_id"));

        return HttpResponse.json({
            cart_items: data.cart_items.filter(i => i.cart_id === cartId),
        });
    })
];
