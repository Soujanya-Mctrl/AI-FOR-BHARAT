import { authClient } from '@/services/betterAuth';
import { User, UserRole } from '@/types/user.types';
import { create } from 'zustand';

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    role: UserRole | null;
}

interface AuthActions {
    setAuth: (user: User) => void;
    clearAuth: () => Promise<void>;
    hydrateFromStorage: () => Promise<void>;
    updateUser: (updates: Partial<User>) => void;
}

export const useAuthStore = create<AuthState & AuthActions>((set, get) => ({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    role: null,

    setAuth: (user: User) => {
        set({
            user,
            isAuthenticated: true,
            isLoading: false,
            role: user.role as UserRole,
        });
    },

    clearAuth: async () => {
        try {
            await authClient.signOut();
        } catch (error) {
            console.error('Sign out error', error);
        }
        set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            role: null,
        });
    },

    hydrateFromStorage: async () => {
        set({ isLoading: true });
        try {
            // Better Auth expoClient plugin automatically uses SecureStore to check the session
            const { data, error } = await authClient.getSession();

            if (data?.user && !error) {
                // Better Auth user maps to our User type but we cast it here 
                // knowing we extended the DB schema for 'role'
                const sessionUser = data.user as unknown as User;
                set({
                    user: sessionUser,
                    isAuthenticated: true,
                    isLoading: false,
                    role: sessionUser.role || 'citizen',
                });
            } else {
                set({
                    user: null,
                    isAuthenticated: false,
                    isLoading: false,
                    role: null,
                });
            }
        } catch {
            set({
                user: null,
                isAuthenticated: false,
                isLoading: false,
                role: null,
            });
        }
    },

    updateUser: (updates: Partial<User>) => {
        const current = get().user;
        if (current) {
            set({ user: { ...current, ...updates } });
        }
    },
}));
