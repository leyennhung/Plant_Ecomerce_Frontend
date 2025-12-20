import { http, HttpResponse } from "msw";

export const cartHandler = [
    http.get("/api/cart", () => {
        return HttpResponse.json([
            {
                id: 1,
                productId: 101,
                name: "Cây Monstera",
                image: "https://via.placeholder.com/100",
                price: 150000,
                quantity: 2
            },
            {
                id: 2,
                productId: 102,
                name: "Cây Lưỡi Hổ",
                image: "https://via.placeholder.com/100",
                price: 250000,
                quantity: 1
            }
        ]);
    })
];
