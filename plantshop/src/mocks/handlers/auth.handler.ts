import { http, HttpResponse } from 'msw';
import type { User, RegisterRequest, LoginRequest } from '../../types/user.type';
import userData from '../data/users.json';
import { USER_STORAGE_KEY, SESSION_STORAGE_KEY, getUserFromRequest } from '../utils';

// Helper: Lấy danh sách user
const getUsers = (): User[] => {
    const stored = localStorage.getItem(USER_STORAGE_KEY);
    if (stored) return JSON.parse(stored);

    const initialUsers = userData.users as User[];
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(initialUsers));
    return initialUsers;
};

// Tạo ID tự tăng (MaxID + 1)
const generateId = (users: User[]): number => {
    if (users.length === 0) return 1;
    const maxId = Math.max(...users.map(u => u.id));
    return maxId + 1;
};

// Tạo Session mới
const createSession = (userId: number): string => {
    const sessions = JSON.parse(localStorage.getItem(SESSION_STORAGE_KEY) || '[]');

    // Tạo token giả
    const token = `mock-token-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Lưu session
    sessions.push({
        token,
        userId,
        //(Hết hạn sau 24h)
        expiry: Date.now() + 24 * 60 * 60 * 1000
    });

    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessions));
    return token;
};

export const authHandlers = [
    // --- ĐĂNG KÝ ---
    http.post('/api/auth/register', async ({ request }) => {
        const body = await request.json() as RegisterRequest;
        const users = getUsers();

        if (users.some(u => u.email === body.email || u.username === body.username)) {
            return HttpResponse.json({ message: 'Username hoặc Email đã tồn tại' }, { status: 400 });
        }

        // Tạo User mới
        const newUser: User = {
            id: generateId(users),
            username: body.username,
            email: body.email,
            password: body.password,
            first_name: "",
            last_name: "",
            phone: "",
            role: 'user',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        };

        users.push(newUser);
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(users));

        return HttpResponse.json(newUser, { status: 201 });
    }),

    // --- ĐĂNG NHẬP ---
    http.post('/api/auth/login', async ({ request }) => {
        const { email, password } = await request.json() as LoginRequest;
        const users = getUsers();
        const user = users.find(u => u.email === email && u.password === password);

        if (!user) {
            return HttpResponse.json({ message: 'Email hoặc mật khẩu không đúng' }, { status: 401 });
        }

        // Tạo session và lấy token
        const token = createSession(user.id);

        return HttpResponse.json({ user, token }, { status: 200 });
    }),

    // --- LẤY INFO USER ---
    http.get('/api/auth/me', ({ request }) => {
        // Dùng hàm tiện ích từ utils để check token
        const user = getUserFromRequest(request);

        if (!user) {
            return HttpResponse.json({ message: 'Phiên đăng nhập hết hạn' }, { status: 401 });
        }

        return HttpResponse.json(user, { status: 200 });
    })
];