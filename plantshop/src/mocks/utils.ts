import type {User} from '../types/user.type';
import userData from './data/users.json';

export const USER_STORAGE_KEY = 'plant_shop_users';
export const SESSION_STORAGE_KEY = 'plant_shop_sessions';

export interface Session {
    token: string;
    userId: number;
    expiry: number;
}

// Hàm lấy User từ Request
// Logic: Header -> Token -> Session -> UserID -> User Data

export const getUserFromRequest = (request: Request): User | null => {
    // Lấy token từ Header
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) return null;

    const token = authHeader.split(' ')[1];

    // Lấy danh sách session từ LocalStorage
    const sessions: Session[] = JSON.parse(localStorage.getItem(SESSION_STORAGE_KEY) || '[]');
    const session = sessions.find(s => s.token === token);

    // Kiểm tra token có tồn tại và còn hạn không
    if (!session || Date.now() > session.expiry) return null;

    // Lấy thông tin User
    const storedUsers = localStorage.getItem(USER_STORAGE_KEY);

    // Ưu tiên lấy từ Storage (nếu có user mới tạo), nếu không thì lấy từ file JSON gốc
    const users: User[] = storedUsers ? JSON.parse(storedUsers) : (userData.users as User[]);

    return users.find(u => u.id === session.userId) || null;
};

export const isLoggedIn = (): boolean => {
    const stored = JSON.parse(localStorage.getItem("user") || "{}");
    const token = stored?.token;
    if (!token) return false;

    const sessions: Session[] = JSON.parse(
        localStorage.getItem(SESSION_STORAGE_KEY) || "[]"
    );

    const session = sessions.find(s => s.token === token);
    return !!session && Date.now() <= session.expiry;
};
