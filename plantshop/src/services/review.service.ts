import type { Review } from "../types/review.type";
import { api } from "./api";

export const reviewService = {
    getReviewByProduct(productId: number): Promise<Review[]> {
        return api.get(`/reviews`, { params: { productId }}).then(res => res.data);
    },
};
