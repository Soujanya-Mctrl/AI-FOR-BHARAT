import { create } from 'zustand';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface UIState {
    toast: { message: string; type: ToastType } | null;
    globalLoading: boolean;
}

interface UIActions {
    showToast: (message: string, type?: ToastType) => void;
    hideToast: () => void;
    setGlobalLoading: (loading: boolean) => void;
}

export const useUIStore = create<UIState & UIActions>((set) => ({
    toast: null,
    globalLoading: false,

    showToast: (message: string, type: ToastType = 'info') => {
        set({ toast: { message, type } });
        // Auto-hide after 3 seconds
        setTimeout(() => {
            set((state) => {
                // Only clear if the same toast is still showing
                if (state.toast?.message === message) {
                    return { toast: null };
                }
                return state;
            });
        }, 3000);
    },

    hideToast: () => set({ toast: null }),
    setGlobalLoading: (loading) => set({ globalLoading: loading }),
}));
