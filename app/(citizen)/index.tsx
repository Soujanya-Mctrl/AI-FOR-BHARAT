import { EcoScoreCard } from '@/components/shared/EcoScoreCard';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { StreakCounter } from '@/components/shared/StreakCounter';
import { Colors } from '@/constants/colors';
import { useAuthStore } from '@/stores/authStore';
import { formatINR } from '@/utils/formatters';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, RefreshControl, ScrollView, Text, View } from 'react-native';

export default function CitizenHomeScreen() {
    const user = useAuthStore((s) => s.user);
    const [refreshing, setRefreshing] = useState(false);

    const segregationScore = user?.citizenProfile?.segregationScore ?? 50;
    const streak = user?.citizenProfile?.currentStreak ?? 0;
    const cashback = user?.citizenProfile?.cashbackBalance ?? 0;

    const onRefresh = async () => {
        setRefreshing(true);
        await useAuthStore.getState().hydrateFromStorage();
        setRefreshing(false);
    };

    // Training gate
    if (user && !user.trainingComplete) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32, backgroundColor: Colors.background }}>
                <Ionicons name="school-outline" size={64} color={Colors.primary[600]} />
                <Text style={{ fontSize: 20, fontWeight: '700', color: Colors.text, marginTop: 16, textAlign: 'center' }}>Complete Training First</Text>
                <Text style={{ fontSize: 14, color: Colors.textSecondary, marginTop: 8, textAlign: 'center' }}>
                    Learn how to segregate waste correctly to unlock pickups and cashback.
                </Text>
                <Pressable onPress={() => router.push('/(citizen)/training')} style={{ marginTop: 24, backgroundColor: Colors.primary[600], paddingHorizontal: 32, paddingVertical: 14, borderRadius: 12 }}>
                    <Text style={{ color: Colors.white, fontWeight: '700', fontSize: 16 }}>Start Training</Text>
                </Pressable>
            </View>
        );
    }

    return (
        <ScrollView
            style={{ flex: 1, backgroundColor: Colors.background }}
            contentContainerStyle={{ paddingBottom: 100 }}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary[600]} />}
        >
            {/* Header */}
            <View style={{ backgroundColor: Colors.primary[600], paddingTop: 60, paddingBottom: 30, paddingHorizontal: 20, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 }}>
                <Text style={{ color: Colors.white, fontSize: 16, opacity: 0.9 }}>Welcome back,</Text>
                <Text style={{ color: Colors.white, fontSize: 24, fontWeight: '800', marginTop: 4 }}>{user?.username || 'Citizen'} 👋</Text>
            </View>

            {/* EcoScore + Streak */}
            <View style={{ flexDirection: 'row', gap: 12, paddingHorizontal: 16, marginTop: -20 }}>
                <View style={{ flex: 1 }}>
                    <EcoScoreCard score={segregationScore} size="small" trend="up" trendValue={5} />
                </View>
                <View style={{ flex: 1 }}>
                    <StreakCounter count={streak} />
                </View>
            </View>

            {/* Cashback Wallet */}
            <View style={{ margin: 16, backgroundColor: Colors.white, borderRadius: 16, padding: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 3 }}>
                <Text style={{ fontSize: 13, color: Colors.textSecondary, fontWeight: '500' }}>Cashback Wallet</Text>
                <Text style={{ fontSize: 28, fontWeight: '800', color: Colors.text, marginTop: 4 }}>{formatINR(cashback)}</Text>
                <Pressable style={{ marginTop: 12, backgroundColor: Colors.primary[50], paddingVertical: 10, borderRadius: 8, alignItems: 'center' }}>
                    <Text style={{ color: Colors.primary[700], fontWeight: '600' }}>Withdraw to UPI</Text>
                </Pressable>
            </View>

            {/* Quick Action */}
            <Pressable
                onPress={() => router.push('/(citizen)/pickup')}
                style={{ marginHorizontal: 16, backgroundColor: Colors.primary[600], paddingVertical: 18, borderRadius: 14, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8 }}
            >
                <Ionicons name="car-outline" size={22} color={Colors.white} />
                <Text style={{ color: Colors.white, fontSize: 17, fontWeight: '700' }}>Request Pickup</Text>
            </Pressable>

            {/* Recent Pickups */}
            <SectionHeader title="Recent Pickups" actionLabel="View All" onAction={() => router.push('/(citizen)/profile')} />
            <View style={{ paddingBottom: 20 }}>
                <View style={{ alignItems: 'center', paddingVertical: 20 }}>
                    <Text style={{ color: Colors.textSecondary }}>No recent pickups yet</Text>
                </View>
            </View>
        </ScrollView>
    );
}
