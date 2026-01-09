import data from "../data/review.json";
import { http, HttpResponse } from "msw"; //hàm có sẵn của thư viện MSW

export const reviewHandlers = [
    //GET API
    http.get("/api/reviews", ({ request }) => {
        const url = new URL(request.url);
        const productId = Number(url.searchParams.get("productId"));
        if (!productId) {
            return HttpResponse.json([]);
        }
        const reviews = data.reviews.filter(
            review => review.productId === productId
        );
        return HttpResponse.json(reviews);
    })
];