import React, { useEffect, useState, useCallback } from 'react';
// ⭐ SỬA LỖI 1: Xóa TypedUseSelectorHook và RootState vì không sử dụng trong file này
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../../store/index'; // Giữ lại AppDispatch để định kiểu useDispatch

import { getWishlist, isApiError, removeProductFromWishlist } from '../../services/wishlist.service';
import type { WishlistItem } from '../../types/wishlist.type';
import { fetchWishlistSuccess, removeFromWishlist } from '../../store/wishlistSlice';

// ⭐ SỬA LỖI 2: Sửa đường dẫn import ProductCard.
// Nếu Wishlist.tsx ở src/pages/wishlist/, ProductCard.tsx ở src/components/product/
// Đường dẫn đúng phải là '../../../components/product/ProductCard'
// (Ra khỏi wishlist, ra khỏi pages, vào components)

import ProductCard from '../../components/common/ProductCard';
import styles from './Wishlist.module.css';

// Khai báo hook đã được định kiểu
const useAppDispatch = () => useDispatch<AppDispatch>();

const Wishlist: React.FC = () => {
    // ... (Toàn bộ logic component giữ nguyên)
    const dispatch = useAppDispatch();
    const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchWishlist = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await getWishlist();
            setWishlistItems(response.items);

            const productIds = response.items.map(item => item.productId);
            dispatch(fetchWishlistSuccess(productIds));
        } catch (error: unknown) {
            let errorMessage = 'Không thể tải danh sách yêu thích. Vui lòng thử lại.';

            if (isApiError(error)) {
                errorMessage = error.response?.data?.message || errorMessage;
            }

            setError(errorMessage);
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, [dispatch]);

    useEffect(() => {
        fetchWishlist();
    }, [fetchWishlist]);

    const handleRemoveFromWishlist = async (productId: number) => {
        try {
            await removeProductFromWishlist(productId);

            setWishlistItems(prev => prev.filter(item => item.productId !== productId));

            dispatch(removeFromWishlist(productId));

            alert('Đã xóa sản phẩm khỏi danh sách yêu thích.');
        } catch (error: unknown) {
            let errorMessage = 'Có lỗi khi xóa khỏi danh sách yêu thích.';

            if (isApiError(error)) {
                errorMessage = error.response?.data?.message || errorMessage;
            }

            console.error('Failed to remove from wishlist:', error);
            alert(errorMessage);
        }
    };

    if (loading) {
        return <div className={styles.container}>Đang tải danh sách yêu thích...</div>;
    }

    if (error) {
        return <div className={styles.container} style={{ color: 'red' }}>{error}</div>;
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>🌱 Sản Phẩm Yêu Thích</h1>
            {wishlistItems.length === 0 ? (
                <p className={styles.emptyMessage}>Danh sách yêu thích của bạn đang trống.</p>
            ) : (
                <div className={styles.list}>
                    {wishlistItems.map((item) => (
                        <div key={item.id} className={styles.itemWrapper}>
                            <ProductCard product={item.product} />

                            <button
                                className={styles.removeButton}
                                onClick={() => handleRemoveFromWishlist(item.productId)}
                            >
                                Xóa khỏi danh sách
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Wishlist;