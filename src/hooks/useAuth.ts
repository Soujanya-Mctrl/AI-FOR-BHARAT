import { authService } from '@/services/auth.service';
import { useAuthStore } from '@/stores/authStore';
import { useUIStore } from '@/stores/uiStore';
import { User } from '@/types/user.types';
import { removeItem, setItem, StorageKeys } from '@/utils/storage';
import { router } from 'expo-router';
import { useCallback } from 'react';

export function useAuth() {
    const { user, isAuthenticated, isLoading, role } = useAuthStore();
    const setAuth = useAuthStore((s) => s.setAuth);
    const clearAuth = useAuthStore((s) => s.clearAuth);
    const showToast = useUIStore((s) => s.showToast);

    const login = useCallback(async (email: string, password: string) => {
        try {
            const data = await authService.login(email, password);
            const jwt = data.jwt || '';
            if (jwt) {
                await setItem(StorageKeys.JWT, jwt);
            }
            setAuth(data.user as unknown as User);
            return data;
        } catch (error: any) {
            const msg = error.response?.data?.message || 'Login failed';
            showToast(msg, 'error');
            throw error;
        }
    }, [setAuth, showToast]);

    const register = useCallback(async (
        username: string,
        email: string,
        password: string,
        userRole: string
    ) => {
        try {
            const data = await authService.register(username, email, password, userRole);
            const jwt = data.jwt || '';
            if (jwt) {
                await setItem(StorageKeys.JWT, jwt);
            }
            setAuth(data.user as unknown as User);
            return data;
        } catch (error: any) {
            const msg = error.response?.data?.message || 'Registration failed';
            showToast(msg, 'error');
            throw error;
        }
    }, [setAuth, showToast]);

    const logout = useCallback(async () => {
        try {
            await authService.logout();
        } finally {
            clearAuth();
            await removeItem(StorageKeys.JWT);
            router.replace('/(auth)/login');
        }
    }, [clearAuth]);

    return {
        user,
        isAuthenticated,
        isLoading,
        role,
        login,
        register,
        logout,
    };
}
