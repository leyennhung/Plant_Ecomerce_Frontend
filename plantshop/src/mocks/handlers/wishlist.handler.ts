import { http, HttpResponse } from 'msw';
import productsData from '../data/products.json';
import {type Product } from '../../types/product.type';
import type {WishlistItem} from '../../types/wishlist.type';

// Dữ liệu Wishlist giả lập (chỉ lưu product IDs)
let mockWishlistIds: number[] = [1, 3];

// Chuyển IDs thành WishlistItem
const createWishlistItems = (ids: number[]): WishlistItem[] => {
    return ids.map(id => {
        const product = productsData.find(p => p.id === id) as Product;
        return {
            id: id, // Dùng tạm product id làm wishlist item id
            userId: 1, // Giả sử user id là 1
            productId: id,
            product: product,
            createdAt: new Date().toISOString(),
        };
    });
};

export const wishlistHandlers = [
    // GET: Lấy danh sách Wishlist
    http.get('/api/wishlist', () => {
        const items = createWishlistItems(mockWishlistIds);
        return HttpResponse.json({
            items: items,
            totalItems: items.length,
        }, { status: 200 });
    }),

    // POST: Thêm sản phẩm vào Wishlist
    http.post('/api/wishlist', async ({ request }) => {
        const { productId } = await request.json() as { productId: number };

        if (mockWishlistIds.includes(productId)) {
            return HttpResponse.json({ message: 'Product already in wishlist' }, { status: 409 });
        }

        const product = productsData.find(p => p.id === productId);
        if (!product) {
            return HttpResponse.json({ message: 'Product not found' }, { status: 404 });
        }

        mockWishlistIds.push(productId);
        return HttpResponse.json({ message: 'Added to wishlist successfully' }, { status: 201 });
    }),

    // DELETE: Xóa sản phẩm khỏi Wishlist (sử dụng product ID)
    http.delete('/api/wishlist/:productId', ({ params }) => {
        const productId = Number(params.productId);
        const initialLength = mockWishlistIds.length;

        mockWishlistIds = mockWishlistIds.filter(id => id !== productId);

        if (mockWishlistIds.length < initialLength) {
            return HttpResponse.json({ message: 'Removed from wishlist successfully' }, { status: 200 });
        } else {
            return HttpResponse.json({ message: 'Product not in wishlist' }, { status: 404 });
        }
    }),
];