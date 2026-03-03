import { Colors } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

export default function NotFoundScreen() {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40, backgroundColor: Colors.background }}>
            <Ionicons name="leaf-outline" size={80} color={Colors.neutral[300]} />
            <Text style={{ fontSize: 24, fontWeight: '700', color: Colors.text, marginTop: 20 }}>Page Not Found</Text>
            <Text style={{ fontSize: 14, color: Colors.textSecondary, marginTop: 8, textAlign: 'center' }}>
                The page you're looking for doesn't exist or has been moved.
            </Text>
            <Pressable onPress={() => router.replace('/')} style={{ marginTop: 24, backgroundColor: Colors.primary[600], paddingHorizontal: 32, paddingVertical: 14, borderRadius: 12 }}>
                <Text style={{ color: Colors.white, fontWeight: '600', fontSize: 16 }}>Go Home</Text>
            </Pressable>
        </View>
    );
}
