import type {Product} from './product.type';

export interface WishlistItem {
    id: number;
    userId: number;
    productId: number;
    product: Product; // Thông tin sản phẩm chi tiết
    createdAt: string;
}

/**
 * Định nghĩa cho response khi lấy danh sách wishlist
 */
export interface WishlistResponse {
    items: WishlistItem[];
    totalItems: number;
}