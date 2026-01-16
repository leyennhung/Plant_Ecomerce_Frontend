import type { Review } from "../types/review.type";
import { api } from "./api";

export const reviewService = {
    getReviewByProduct(productId: number): Promise<Review[]> {
        return api.get(`/reviews`, { params: { productId }}).then(res => res.data);
    },
    addReview(review: Omit<Review, "id" | "createdAt">): Promise<Review> {
        return api.post("/reviews", review).then(res => res.data);
    },
};
