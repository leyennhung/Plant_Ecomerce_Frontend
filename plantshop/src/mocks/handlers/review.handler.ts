import data from "../data/review.json";
import { http, HttpResponse } from "msw"; //hàm có sẵn của thư viện MSW
import type {Review} from "../../types/review.type";
export const reviewHandlers = [
    //GET API
    http.get("/api/reviews", ({ request }) => {
        const url = new URL(request.url);
        const productId = Number(url.searchParams.get("productId"));
        // Lấy từ localStorage trước
        let storedReviews: Review[] = [];
        const local = localStorage.getItem("reviews");
        if (local) {
            storedReviews = JSON.parse(local);
        }
        // Nếu productId có, filter
        const reviews = productId
            ? storedReviews.filter(r => r.productId === productId)
            : storedReviews;
        // Nếu localStorage chưa có dữ liệu, fallback dùng data.json
        if (reviews.length === 0) {
            const fallback = data.reviews.filter(r => r.productId === productId);
            return HttpResponse.json(fallback);
        }
        return HttpResponse.json(reviews);
    }),
    // POST API: Thêm review mới
    http.post("/api/reviews", async ({ request }) => {
        const body = (await request.json()) as Omit<Review, "id" | "createdAt">;

        if (!body.productId || !body.slug || !body.user || !body.rating || !body.content) {
            return HttpResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const newReview: Review = {
            id: data.reviews.length + 1,
            createdAt: new Date().toISOString(),
            ...body,
            slug: body.slug,
        };

        // data.reviews.push(newReview);
        // Lấy danh sách hiện tại từ localStorage
        const local = localStorage.getItem("reviews");
        const reviews: Review[] = local ? JSON.parse(local) : data.reviews;

        reviews.push(newReview);

        // Lưu lại vào localStorage
        localStorage.setItem("reviews", JSON.stringify(reviews));
        return HttpResponse.json(newReview, { status: 201 });
    }),
];