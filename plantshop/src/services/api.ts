import axios from "axios";

export const api = axios.create({
    baseURL: "/api",
    headers: {
        "Content-Type": "application/json"
    }
});

// Interceptor: Tự động gắn Token vào request
api.interceptors.request.use(
    (config) => {
        // Lấy key 'user'
        const storedUser = localStorage.getItem('user');

        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                const token = parsedUser.token;
                // Nếu có token thì gắn vào header Authorization
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
            } catch (error) {
                console.error("Lỗi parse user token", error);
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);