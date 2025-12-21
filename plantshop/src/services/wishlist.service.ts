import axios from 'axios';
import type {WishlistResponse} from '../types/wishlist.type';

const API_URL = '/api/wishlist';
// src/services/wishlist.service.ts

// Định nghĩa kiểu dữ liệu cho lỗi API (Axios Error)
interface ApiError {
    response?: {
        data?: {
            message: string;
        };
        status?: number;
    };
    // Có thể thêm các thuộc tính Axios khác nếu cần (ví dụ: isAxiosError: boolean)
}

//  HÀM BẢO VỆ KIỂU (TYPE GUARD) KHÔNG DÙNG 'any'
export function isApiError(error: unknown): error is ApiError {
    if (typeof error !== 'object' || error === null) {
        return false;
    }

    // Kiểm tra sự tồn tại của thuộc tính 'response'
    if ('response' in error) {
        const response = (error as ApiError).response;

        // Kiểm tra xem response có phải là object và không null
        if (typeof response === 'object' && response !== null) {
            // Kiểm tra sâu hơn nếu cần, nhưng chỉ cần kiểm tra 'response' là đủ cho Type Guard này
            return true;
        }
    }

    return false;
}

// ... (các hàm service khác: getWishlist, addProductToWishlist, removeProductFromWishlist)
/**
 * Lấy danh sách sản phẩm yêu thích của người dùng hiện tại
 * @returns Promise<WishlistResponse>
 */
export const getWishlist = async (): Promise<WishlistResponse> => {
    const response = await axios.get(API_URL);
    return response.data;
};

/**
 * Thêm sản phẩm vào Wishlist
 * @param productId ID của sản phẩm cần thêm
 * @returns Promise<{ message: string }>
 */
export const addProductToWishlist = async (productId: number): Promise<{ message: string }> => {
    const response = await axios.post(API_URL, { productId });
    return response.data;
};

/**
 * Xóa sản phẩm khỏi Wishlist
 * @param productId ID của sản phẩm cần xóa
 * @returns Promise<{ message: string }>
 */
export const removeProductFromWishlist = async (productId: number): Promise<{ message: string }> => {
    const response = await axios.delete(`${API_URL}/${productId}`);
    return response.data;
};