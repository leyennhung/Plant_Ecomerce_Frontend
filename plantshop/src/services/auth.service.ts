// src/services/auth.service.ts
import axios from 'axios';
import type {RegisterRequest} from '../types/user.type'; // Import type đã tạo
// Import type đã tạo

// Cấu hình base URL (khớp với MSW)
const API_URL = '/api/auth';

const register = async (userData: RegisterRequest) => {
    // Gửi POST request đến đường dẫn mà MSW đang chặn
    const response = await axios.post(`${API_URL}/register`, userData);
    return response.data;
};

const login = async (credentials: any) => {
    const response = await axios.post(`${API_URL}/login`, credentials);
    if (response.data.token) {
        localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
};

const AuthService = {
    register,
    login,
};

export default AuthService;