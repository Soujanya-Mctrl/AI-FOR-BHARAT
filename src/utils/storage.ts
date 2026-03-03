import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

/**
 * Get an item from secure storage
 * Falls back to AsyncStorage on web (SecureStore not available)
 */
export async function getItem(key: string): Promise<string | null> {
    try {
        if (Platform.OS === 'web') {
            return await AsyncStorage.getItem(key);
        }
        return await SecureStore.getItemAsync(key);
    } catch {
        return null;
    }
}

/**
 * Set an item in secure storage
 */
export async function setItem(key: string, value: string): Promise<void> {
    try {
        if (Platform.OS === 'web') {
            await AsyncStorage.setItem(key, value);
            return;
        }
        await SecureStore.setItemAsync(key, value);
    } catch {
        // Silently fail — auth flow handles missing tokens gracefully
    }
}

/**
 * Remove an item from secure storage
 */
export async function removeItem(key: string): Promise<void> {
    try {
        if (Platform.OS === 'web') {
            await AsyncStorage.removeItem(key);
            return;
        }
        await SecureStore.deleteItemAsync(key);
    } catch {
        // Silently fail
    }
}

/** Storage keys used throughout the app */
export const StorageKeys = {
    JWT: 'jwt',
    ONBOARDING_COMPLETE: 'onboarding_complete',
    PUSH_TOKEN: 'push_token',
    OFFLINE_QUEUE: 'offline_queue',
} as const;
