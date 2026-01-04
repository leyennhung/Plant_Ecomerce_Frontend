export interface User {
    id: number | string;
    username: string;
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    phone: string;
    role: 'admin' | 'user';
    created_at: string;
    updated_at: string;
}

export type RegisterRequest = Pick<User, 'username' | 'email' | 'password'>;
export type LoginRequest = Pick<User, 'email' | 'password'>;