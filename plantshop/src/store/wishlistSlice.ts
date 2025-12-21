import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

// Giả sử Wishlist chỉ lưu trữ IDs sản phẩm để kiểm tra nhanh
interface WishlistState {
    productIds: number[];
    isLoading: boolean;
    error: string | null;
}

const initialState: WishlistState = {
    productIds: [],
    isLoading: false,
    error: null,
};

const wishlistSlice = createSlice({
    name: 'wishlist',
    initialState,
    reducers: {
        // Action khi bắt đầu fetch
        fetchWishlistStart: (state) => {
            state.isLoading = true;
            state.error = null;
        },
        // Action khi fetch thành công
        fetchWishlistSuccess: (state, action: PayloadAction<number[]>) => {
            state.isLoading = false;
            state.productIds = action.payload;
        },
        // Action khi fetch thất bại
        fetchWishlistFailure: (state, action: PayloadAction<string>) => {
            state.isLoading = false;
            state.error = action.payload;
        },
        // Thêm 1 sản phẩm vào Wishlist
        addToWishlist: (state, action: PayloadAction<number>) => {
            if (!state.productIds.includes(action.payload)) {
                state.productIds.push(action.payload);
            }
        },
        // Xóa 1 sản phẩm khỏi Wishlist
        removeFromWishlist: (state, action: PayloadAction<number>) => {
            state.productIds = state.productIds.filter(id => id !== action.payload);
        },
    },
});

export const {
    fetchWishlistStart,
    fetchWishlistSuccess,
    fetchWishlistFailure,
    addToWishlist,
    removeFromWishlist,
} = wishlistSlice.actions;

export default wishlistSlice.reducer;

// Selector để kiểm tra sản phẩm có trong wishlist không
export const selectIsProductInWishlist = (productId: number) => (state: any) =>
    state.wishlist.productIds.includes(productId);