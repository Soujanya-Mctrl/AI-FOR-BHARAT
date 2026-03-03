import { configureNotifications, getExpoPushToken } from '@/services/notification.service';
import { userService } from '@/services/user.service';
import { useAuthStore } from '@/stores/authStore';
import * as Notifications from 'expo-notifications';
import { useEffect, useState } from 'react';
import { Platform } from 'react-native';

export function usePushNotifications() {
    const [permissionStatus, setPermissionStatus] = useState<'granted' | 'denied' | 'undetermined'>('undetermined');
    const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

    useEffect(() => {
        if (Platform.OS === 'web' || !isAuthenticated) return;

        // Configure how notifications are displayed
        configureNotifications();

        (async () => {
            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            setPermissionStatus(existingStatus === 'granted' ? 'granted' : 'undetermined');

            const token = await getExpoPushToken();
            if (token) {
                setPermissionStatus('granted');
                try {
                    await userService.registerPushToken(token);
                } catch {
                    // Silently fail — will retry on next launch
                }
            }
        })();
    }, [isAuthenticated]);

    return { permissionStatus };
}
