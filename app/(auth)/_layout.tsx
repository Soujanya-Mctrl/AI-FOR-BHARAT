import { useAuthStore } from '@/stores/authStore';
import { Redirect, Stack } from 'expo-router';

export default function AuthLayout() {
    const { isAuthenticated, role } = useAuthStore();

    if (isAuthenticated) {
        switch (role) {
            case 'kabadiwalla': return <Redirect href="/(kabadiwalla)" />;
            case 'municipality': return <Redirect href="/(municipality)" />;
            case 'admin': return <Redirect href="/(admin)" />;
            default: return <Redirect href="/(citizen)" />;
        }
    }

    return <Stack screenOptions={{ headerShown: false }} />;
}
