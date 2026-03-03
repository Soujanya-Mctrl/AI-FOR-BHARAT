import { PushNotificationHandler } from '@/components/native/PushNotificationHandler';
import { Toast } from '@/components/shared/Toast';
import { useAuthStore } from '@/stores/authStore';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Platform } from 'react-native';
import '../global.css';

export default function RootLayout() {
  const hydrateFromStorage = useAuthStore((s) => s.hydrateFromStorage);
  const isLoading = useAuthStore((s) => s.isLoading);

  useEffect(() => {
    hydrateFromStorage();
  }, []);

  if (isLoading) {
    // Keep splash screen visible or show blank while better-auth validates the secure cookie
    return null;
  }

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(citizen)" />
        <Stack.Screen name="(kabadiwalla)" />
        <Stack.Screen name="(municipality)" />
        <Stack.Screen name="(admin)" />
        <Stack.Screen name="+not-found" />
      </Stack>
      <Toast />
      {Platform.OS !== 'web' && <PushNotificationHandler />}
      <StatusBar style="auto" />
    </>
  );
}
