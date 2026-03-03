import { Config } from '@/constants/config';
import { getItem, removeItem, StorageKeys } from '@/utils/storage';
import axios, { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { router } from 'expo-router';

const api = axios.create({
    baseURL: Config.API_URL,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor — attach JWT from SecureStore
api.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
        const token = await getItem(StorageKeys.JWT);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        // Always identify as mobile client
        config.headers['X-Client-Type'] = 'mobile';
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor — handle 401 logout
api.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error) => {
        if (error.response?.status === 401) {
            await removeItem(StorageKeys.JWT);
            // Use require to avoid circular dependency with authStore
            try {
                const { useAuthStore } = require('@/stores/authStore');
                useAuthStore.getState().clearAuth();
            } catch { }
            router.replace('/(auth)/login');
        }
        return Promise.reject(error);
    }
);

export default api;
