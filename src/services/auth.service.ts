import { AuthResponse } from '@/types/api.types';
import { User } from '@/types/user.types';
import api from './api';

export const authService = {
    /**
     * Login with email and password
     * Returns JWT + user data for mobile clients
     */
    async login(email: string, password: string): Promise<AuthResponse> {
        const { data } = await api.post<AuthResponse>('/login', { email, password });
        return data;
    },

    /**
     * Register a new user with role selection
     */
    async register(
        username: string,
        email: string,
        password: string,
        role: string
    ): Promise<AuthResponse> {
        const { data } = await api.post<AuthResponse>('/register', {
            username,
            email,
            password,
            role,
        });
        return data;
    },

    /**
     * Verify current JWT token and get user data
     */
    async getMe(): Promise<{ user: User }> {
        const { data } = await api.get('/verify');
        return data;
    },

    /**
     * Logout — clear server session
     */
    async logout(): Promise<void> {
        try {
            await api.post('/logout');
        } catch {
            // Ignore error — we clear local state regardless
        }
    },
};
