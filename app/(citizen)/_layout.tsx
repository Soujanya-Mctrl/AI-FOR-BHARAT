import { Colors } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

export default function CitizenLayout() {
    return (
        <Tabs screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: Colors.primary[600],
            tabBarInactiveTintColor: Colors.neutral[400],
            tabBarStyle: { backgroundColor: Colors.white, borderTopColor: Colors.border, paddingBottom: 4, height: 56 },
            tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        }}>
            <Tabs.Screen name="index" options={{ title: 'Home', tabBarIcon: ({ color, size }) => <Ionicons name="home-outline" size={size} color={color} /> }} />
            <Tabs.Screen name="report" options={{ title: 'Report', tabBarIcon: ({ color, size }) => <Ionicons name="camera-outline" size={size} color={color} /> }} />
            <Tabs.Screen name="pickup" options={{ title: 'Pickup', tabBarIcon: ({ color, size }) => <Ionicons name="car-outline" size={size} color={color} /> }} />
            <Tabs.Screen name="profile" options={{ title: 'Profile', tabBarIcon: ({ color, size }) => <Ionicons name="person-outline" size={size} color={color} /> }} />
            <Tabs.Screen name="training" options={{ href: null }} />
            <Tabs.Screen name="facilities" options={{ href: null }} />
            <Tabs.Screen name="pickup/[id]" options={{ href: null }} />
        </Tabs>
    );
}
