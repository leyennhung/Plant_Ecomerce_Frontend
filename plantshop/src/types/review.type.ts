export interface ReviewUser {
    id: number;
    name: string;
    avatar?: string;
}

export interface Review {
    id: number;
    productId: number;
    user: ReviewUser;
    rating: number; // 1 → 5 sao
    content: string;
    createdAt: string;
}
