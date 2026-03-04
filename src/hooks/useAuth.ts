import { authClient } from '@/services/betterAuth';
import { useAuthStore } from '@/stores/authStore';
import { useUIStore } from '@/stores/uiStore';
import { User } from '@/types/user.types';
import { removeItem, StorageKeys } from '@/utils/storage';
import { router } from 'expo-router';
import { useCallback } from 'react';

export function useAuth() {
    const { user, isAuthenticated, isLoading, role } = useAuthStore();
    const setAuth = useAuthStore((s) => s.setAuth);
    const clearAuth = useAuthStore((s) => s.clearAuth);
    const showToast = useUIStore((s) => s.showToast);

    const login = useCallback(async (email: string, password: string) => {
        try {
            const { data, error } = await authClient.signIn.email({
                email,
                password,
            });
            if (error) {
                throw new Error(error.message || 'Login failed');
            }
            if (data?.user) {
                setAuth(data.user as unknown as User);
            }
            return data;
        } catch (error: any) {
            const msg = error.message || 'Login failed';
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
            const { data, error } = await authClient.signUp.email({
                email,
                password,
                name: username,
                role: userRole,
            } as any);
            if (error) {
                throw new Error(error.message || 'Registration failed');
            }
            if (data?.user) {
                setAuth(data.user as unknown as User);
            }
            return data;
        } catch (error: any) {
            const msg = error.message || 'Registration failed';
            showToast(msg, 'error');
            throw error;
        }
    }, [setAuth, showToast]);

    const loginWithGoogle = useCallback(async () => {
        try {
            const { data, error } = await authClient.signIn.social({
                provider: "google",
                callbackURL: "ecowaste://",
            });
            if (error) {
                throw new Error(error.message || 'Google login failed');
            }
            // `data` here might contain the user if signed in instantly, or Better Auth might redirect via Expo's WebBrowser
        } catch (error: any) {
            const msg = error.message || 'Google login failed';
            showToast(msg, 'error');
            throw error;
        }
    }, [showToast]);

    const logout = useCallback(async () => {
        try {
            const { error } = await authClient.signOut();
            if (error) {
                throw new Error(error.message);
            }
        } catch (error: any) {
            showToast(error.message || 'Logout failed', 'error');
        } finally {
            clearAuth();
            await removeItem(StorageKeys.JWT);
            router.replace('/(auth)/login');
        }
    }, [clearAuth, showToast]);

    return {
        user,
        isAuthenticated,
        isLoading,
        role,
        login,
        register,
        loginWithGoogle,
        logout,
    };
}

