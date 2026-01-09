import { http, HttpResponse } from 'msw';
import type {User, RegisterRequest, LoginRequest} from '../../types/user.type';

const STORAGE_KEY = 'plant_shop_users';

// Dữ liệu mẫu khởi tạo
const initialUsers: User[] = [
    {
        id: 1,
        username: "user",
        email: "user@gmail.com",
        password: "123",
        first_name: "Khach",
        last_name: "Hang",
        phone: "0909123457",
        role: "user",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    }
];

/**
 * Hàm lấy danh sách user:
 * - Ưu tiên lấy từ LocalStorage.
 * - Nếu LocalStorage chưa có (lần đầu chạy), lấy từ initialUsers và lưu vào Storage.
 */
const getUsersFromStorage = (): User[] => {
    const storedData = localStorage.getItem(STORAGE_KEY);

    if (storedData) {
        return JSON.parse(storedData);
    }

    // Khởi tạo lần đầu
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialUsers));
    return initialUsers;
};

export const authHandlers = [
    // --- API ĐĂNG KÝ ---
    http.post('/api/auth/register', async ({ request }) => {
        const data = await request.json() as RegisterRequest;
        const users = getUsersFromStorage();

        // 1. Kiểm tra trùng email hoặc username
        const isExist = users.some(u => u.email === data.email || u.username === data.username);
        if (isExist) {
            return HttpResponse.json(
                { message: 'Username hoặc Email đã tồn tại' },
                { status: 400 }
            );
        }

        // 2. Tạo user mới
        const newUser: User = {
            id: Date.now(),
            username: data.username,
            email: data.email,
            password: data.password,
            first_name: "", // Mặc định rỗng
            last_name: "",  // Mặc định rỗng
            phone: "",      // Mặc định rỗng
            role: 'user',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        };

        // 3. Lưu vào LocalStorage
        users.push(newUser);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(users));

        return HttpResponse.json(newUser, { status: 201 });
    }),

    // --- API ĐĂNG NHẬP ---
    http.post('/api/auth/login', async ({ request }) => {
        // 2. SỬA LỖI ANY: Dùng LoginRequest
        const { email, password } = await request.json() as LoginRequest;

        const users = getUsersFromStorage();

        // Tìm user
        const user = users.find(u => u.email === email && u.password === password);

        if (!user) {
            return HttpResponse.json(
                { message: 'Email hoặc mật khẩu không đúng' },
                { status: 401 }
            );
        }

        // Trả về user + token
        return HttpResponse.json({
            user: user,
            token: 'mock-token-jwt-123456789'
        }, { status: 200 });
    }),

    // --- API LẤY THÔNG TIN USER (ME) ---
    // Dùng để giữ trạng thái đăng nhập khi F5
    http.get('/api/auth/me', () => {
        // Logic thực tế: Parse header Authorization để tìm user
        // Ở đây mock: Bạn có thể trả về lỗi 401 để Frontend tự check LocalStorage
        return HttpResponse.json({ message: "Mock Me API" });
    })
];