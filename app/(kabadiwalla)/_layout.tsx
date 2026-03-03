import { Colors } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

export default function KabadiwalaLayout() {
    return (
        <Tabs screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: Colors.secondary[600],
            tabBarInactiveTintColor: Colors.neutral[400],
            tabBarStyle: { backgroundColor: Colors.white, borderTopColor: Colors.border, paddingBottom: 4, height: 56 },
            tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        }}>
            <Tabs.Screen name="index" options={{ title: 'Today', tabBarIcon: ({ color, size }) => <Ionicons name="map-outline" size={size} color={color} /> }} />
            <Tabs.Screen name="earnings" options={{ title: 'Earnings', tabBarIcon: ({ color, size }) => <Ionicons name="wallet-outline" size={size} color={color} /> }} />
            <Tabs.Screen name="onboarding" options={{ href: null }} />
            <Tabs.Screen name="confirm/[id]" options={{ href: null }} />
        </Tabs>
    );
}
