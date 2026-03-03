import { EcoScoreCard } from '@/components/shared/EcoScoreCard';
import { StreakCounter } from '@/components/shared/StreakCounter';
import { Colors } from '@/constants/colors';
import { useAuth } from '@/hooks/useAuth';
import { useAuthStore } from '@/stores/authStore';
import { formatINR } from '@/utils/formatters';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

export default function ProfileScreen() {
    const user = useAuthStore((s) => s.user);
    const { logout } = useAuth();
    const cp = user?.citizenProfile;

    return (
        <ScrollView style={{ flex: 1, backgroundColor: Colors.background }} contentContainerStyle={{ paddingBottom: 100 }}>
            {/* Profile Header */}
            <View style={{ backgroundColor: Colors.primary[600], paddingTop: 60, paddingBottom: 30, paddingHorizontal: 24, alignItems: 'center' }}>
                <View style={{ width: 72, height: 72, borderRadius: 36, backgroundColor: Colors.primary[400], justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ color: Colors.white, fontSize: 28, fontWeight: '700' }}>{user?.username?.[0]?.toUpperCase() || '?'}</Text>
                </View>
                <Text style={{ color: Colors.white, fontSize: 20, fontWeight: '700', marginTop: 12 }}>{user?.username}</Text>
                <Text style={{ color: Colors.primary[200], fontSize: 14 }}>{user?.email}</Text>
            </View>

            {/* Score */}
            <View style={{ margin: 16 }}>
                <EcoScoreCard score={cp?.segregationScore ?? 50} label="Segregation Score" size="large" trend="up" trendValue={3} />
            </View>

            <View style={{ marginHorizontal: 16 }}>
                <StreakCounter count={cp?.currentStreak ?? 0} />
            </View>

            {/* Cashback Wallet */}
            <View style={{ margin: 16, backgroundColor: Colors.white, borderRadius: 16, padding: 20 }}>
                <Text style={{ fontSize: 14, color: Colors.textSecondary, fontWeight: '500' }}>Cashback Wallet</Text>
                <Text style={{ fontSize: 28, fontWeight: '800', color: Colors.text, marginTop: 4 }}>{formatINR(cp?.cashbackBalance ?? 0)}</Text>
                <Text style={{ fontSize: 12, color: Colors.textSecondary, marginTop: 4 }}>Total earned: {formatINR(cp?.totalCashbackEarned ?? 0)}</Text>
                <Pressable style={{ marginTop: 16, backgroundColor: Colors.primary[600], paddingVertical: 12, borderRadius: 8, alignItems: 'center' }}>
                    <Text style={{ color: Colors.white, fontWeight: '600' }}>Withdraw to UPI</Text>
                </Pressable>
            </View>

            {/* Stats */}
            <View style={{ margin: 16, backgroundColor: Colors.white, borderRadius: 16, padding: 20 }}>
                <Text style={{ fontSize: 16, fontWeight: '600', color: Colors.text, marginBottom: 12 }}>Stats</Text>
                {[
                    { label: 'Verified Pickups', value: String(cp?.totalVerifiedPickups ?? 0) },
                    { label: 'Longest Streak', value: `${cp?.longestStreak ?? 0} days` },
                    { label: 'Points', value: String(user?.points ?? 0) },
                ].map((stat) => (
                    <View key={stat.label} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: Colors.neutral[100] }}>
                        <Text style={{ color: Colors.textSecondary }}>{stat.label}</Text>
                        <Text style={{ fontWeight: '600', color: Colors.text }}>{stat.value}</Text>
                    </View>
                ))}
            </View>

            {/* Actions */}
            <View style={{ margin: 16, gap: 12 }}>
                <Pressable onPress={() => router.push('/(citizen)/facilities')} style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.white, borderRadius: 12, padding: 16, gap: 12 }}>
                    <Ionicons name="location-outline" size={22} color={Colors.primary[600]} />
                    <Text style={{ flex: 1, fontSize: 15, color: Colors.text }}>Nearby Facilities</Text>
                    <Ionicons name="chevron-forward" size={18} color={Colors.neutral[400]} />
                </Pressable>

                <Pressable onPress={logout} style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.white, borderRadius: 12, padding: 16, gap: 12 }}>
                    <Ionicons name="log-out-outline" size={22} color={Colors.error.DEFAULT} />
                    <Text style={{ flex: 1, fontSize: 15, color: Colors.error.DEFAULT }}>Logout</Text>
                </Pressable>
            </View>
        </ScrollView>
    );
}
