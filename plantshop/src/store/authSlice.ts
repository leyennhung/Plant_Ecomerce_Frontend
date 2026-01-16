import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type {User} from "../types/user.type";

// Kiểu dữ liệu cho Auth State
interface AuthState {
    currentUser: User | null;
    isAuthenticated: boolean;
    token: string | null;
}

// Khởi tạo state ban đầu
const storedData = localStorage.getItem("user");
let initialUser: User | null = null;
let initialToken: string | null = null;

if (storedData) {
    try {
        const parsedData = JSON.parse(storedData);
        initialUser = parsedData.user;
        initialToken = parsedData.token;
    } catch (error) {
        console.error("Lỗi parse user từ storage", error);
    }
}

const initialState: AuthState = {
    currentUser: initialUser,
    isAuthenticated: !!initialUser, // Nếu có user thì là true
    token: initialToken
};

// Tạo Slice
const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        // Action: Đăng nhập thành công -> Cập nhật state
        loginSuccess: (state, action: PayloadAction<{ user: User; token: string }>) => {
            state.currentUser = action.payload.user;
            state.token = action.payload.token;
            state.isAuthenticated = true;
            // Lưu ý: Việc lưu vào localStorage đã được xử lý ở auth.service.ts hoặc tại nơi gọi hàm này
        },

        // Action: Đăng xuất -> Xóa state
        logout: (state) => {
            state.currentUser = null;
            state.token = null;
            state.isAuthenticated = false;
            // Xóa luôn dưới localStorage
            localStorage.removeItem("user");
            localStorage.removeItem("plant_shop_sessions"); // Xóa session nếu muốn sạch sẽ
        },

        // Action: Cập nhật thông tin user
        updateUser: (state, action: PayloadAction<User>) => {
            state.currentUser = action.payload;
            // Cập nhật lại localStorage để đồng bộ
            const stored = localStorage.getItem("user");
            if (stored) {
                const parsed = JSON.parse(stored);
                parsed.user = action.payload;
                localStorage.setItem("user", JSON.stringify(parsed));
            }
        }
    },
});

export const { loginSuccess, logout, updateUser } = authSlice.actions;
export default authSlice.reducer;