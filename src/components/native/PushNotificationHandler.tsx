import { configureNotifications, getExpoPushToken } from '@/services/notification.service';
import { userService } from '@/services/user.service';
import * as Notifications from 'expo-notifications';
import { router } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Platform } from 'react-native';

export function PushNotificationHandler() {
    const notificationListener = useRef<Notifications.EventSubscription>(null);
    const responseListener = useRef<Notifications.EventSubscription>(null);

    useEffect(() => {
        if (Platform.OS === 'web') return;

        configureNotifications();

        // Register push token
        (async () => {
            const token = await getExpoPushToken();
            if (token) {
                try { await userService.registerPushToken(token); } catch { }
            }
        })();

        // Listen for incoming notifications while app is open
        notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
            // Notification received while app is foregrounded
            console.log('Notification received:', notification.request.content);
        });

        // Listen for notification taps
        responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
            const data = response.notification.request.content.data;
            if (data?.pickupId) {
                router.push(`/(citizen)/pickup/${data.pickupId}` as any);
            }
        });

        return () => {
            notificationListener.current?.remove();
            responseListener.current?.remove();
        };
    }, []);

    return null; // Invisible component
}
