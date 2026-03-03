import { Colors } from '@/constants/colors';
import { useAuthStore } from '@/stores/authStore';
import { Redirect } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';

export default function IndexScreen() {
    const { isAuthenticated, isLoading, role } = useAuthStore();

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.primary[600] }}>
                <ActivityIndicator size="large" color={Colors.white} />
            </View>
        );
    }

    if (!isAuthenticated) {
        return <Redirect href="/(auth)/login" />;
    }

    // Role-based redirect
    switch (role) {
        case 'kabadiwalla':
            return <Redirect href="/(kabadiwalla)" />;
        case 'municipality':
            return <Redirect href="/(municipality)" />;
        case 'admin':
            return <Redirect href="/(admin)" />;
        case 'citizen':
        default:
            return <Redirect href="/(citizen)" />;
    }
}
