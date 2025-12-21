import React from 'react';
import {useDispatch, useSelector, type TypedUseSelectorHook} from 'react-redux';
import type {RootState, AppDispatch} from '../../store/index';

import {selectIsProductInWishlist, addToWishlist, removeFromWishlist} from '../../store/wishlistSlice';
import {addProductToWishlist, removeProductFromWishlist, isApiError} from '../../services/wishlist.service';

const useAppDispatch = () => useDispatch<AppDispatch>();
const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export interface Product {
    id: number;
    name: string;
    price: number;
    imageUrl: string;
}

interface ProductCardProps {
    product: Product;
    onAddToCart?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({product, onAddToCart}) => {
    const dispatch = useAppDispatch();
    const isFavourite = useAppSelector(selectIsProductInWishlist(product.id));

    const handleToggleWishlist = async () => {
        try {
            if (isFavourite) {
                await removeProductFromWishlist(product.id);
                dispatch(removeFromWishlist(product.id));
                console.log(`Removed product ${product.id} from wishlist.`);
            } else {
                await addProductToWishlist(product.id);
                dispatch(addToWishlist(product.id));
                console.log(`Added product ${product.id} to wishlist.`);
            }
        } catch (error: unknown) {

            let errorMessage = 'Có lỗi xảy ra khi cập nhật danh sách yêu thích.';

            // ⭐ SỬ DỤNG TYPE GUARD KHÔNG 'ANY' ĐỂ TRUY CẬP LỖI
            if (isApiError(error)) {
                // error là kiểu ApiError an toàn
                errorMessage = error.response?.data?.message || errorMessage;
            } else if (error instanceof Error) {
                // Xử lý lỗi JavaScript chuẩn (ví dụ: lỗi parsing)
                errorMessage = error.message;
            }

            console.error('Wishlist operation failed:', errorMessage, error);
            alert(errorMessage);
        }
    };

    return (
        <div className="border rounded shadow p-4 flex flex-col items-center gap-2 max-w-xs relative bg-white">

            {/* Nút Yêu Thích (Wishlist Button) */}
            <button
                className={`absolute top-2 right-2 p-2 rounded-full transition duration-200 
                            ${isFavourite
                    ? 'text-red-500 hover:text-red-600 bg-white shadow-md'
                    : 'text-gray-400 hover:text-red-500 bg-gray-100 hover:bg-white'}`}
                onClick={handleToggleWishlist}
                aria-label={isFavourite ? 'Xóa khỏi yêu thích' : 'Thêm vào yêu thích'}
            >
                {/* Icon trái tim */}
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    viewBox="0 0 24 24"
                    fill={isFavourite ? 'currentColor' : 'none'}
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path
                        d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
            </button>

            {/* Code cũ của bạn */}
            <img
                src={product.imageUrl}
                alt={product.name}
                className="w-32 h-32 object-cover rounded"
            />
            <h2 className="text-lg font-semibold">{product.name}</h2>
            <p className="text-gray-700">${product.price.toFixed(2)}</p>
            <button
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 w-full"
                onClick={() => onAddToCart?.(product)}
            >
                Add to Cart
            </button>
        </div>
    );
};
export default ProductCard;