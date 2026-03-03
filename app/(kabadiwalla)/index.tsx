import { RouteMap } from '@/components/native/RouteMap';
import { EmptyState } from '@/components/shared/EmptyState';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { PickupCard } from '@/components/shared/PickupCard';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { Colors } from '@/constants/colors';
import { useLocation } from '@/hooks/useLocation';
import { pickupService } from '@/services/pickup.service';
import { useAuthStore } from '@/stores/authStore';
import type { PickupRequest } from '@/types/pickup.types';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Pressable, RefreshControl, ScrollView, Text, View } from 'react-native';

export default function KabadiwalaHomeScreen() {
    const user = useAuthStore((s) => s.user);
    const { currentLocation } = useLocation();
    const [todayRoute, setTodayRoute] = useState<PickupRequest[]>([]);
    const [pendingRequests, setPendingRequests] = useState<PickupRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchData = async () => {
        try {
            const [route, pending] = await Promise.allSettled([
                pickupService.getTodayRoute(),
                currentLocation ? pickupService.getNearbyRequests(currentLocation.lat, currentLocation.lng) : Promise.resolve([]),
            ]);
            setTodayRoute(route.status === 'fulfilled' ? route.value : []);
            setPendingRequests(pending.status === 'fulfilled' ? pending.value : []);
        } catch { } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => { fetchData(); }, [currentLocation]);

    const handleAccept = async (id: string) => {
        try {
            await pickupService.acceptPickup(id);
            fetchData();
        } catch { }
    };

    if (loading) return <LoadingSpinner message="Loading your route..." />;

    return (
        <ScrollView
            style={{ flex: 1, backgroundColor: Colors.background }}
            contentContainerStyle={{ paddingBottom: 100 }}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchData(); }} />}
        >
            <View style={{ backgroundColor: Colors.secondary[600], paddingTop: 60, paddingBottom: 24, paddingHorizontal: 20, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 }}>
                <Text style={{ color: Colors.white, fontSize: 16, opacity: 0.9 }}>Good morning,</Text>
                <Text style={{ color: Colors.white, fontSize: 24, fontWeight: '800', marginTop: 4 }}>{user?.username || 'Kabadiwalla'} 🚲</Text>
                <View style={{ flexDirection: 'row', gap: 16, marginTop: 16 }}>
                    <View style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 10, padding: 12 }}>
                        <Text style={{ color: Colors.white, fontSize: 24, fontWeight: '700' }}>{todayRoute.length}</Text>
                        <Text style={{ color: Colors.white, opacity: 0.8, fontSize: 12 }}>Today's Pickups</Text>
                    </View>
                    <View style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 10, padding: 12 }}>
                        <Text style={{ color: Colors.white, fontSize: 24, fontWeight: '700' }}>{pendingRequests.length}</Text>
                        <Text style={{ color: Colors.white, opacity: 0.8, fontSize: 12 }}>Pending</Text>
                    </View>
                </View>
            </View>

            {/* Route Map */}
            {todayRoute.length > 0 && (
                <View style={{ margin: 16 }}>
                    <RouteMap stops={todayRoute.map((p) => ({
                        lat: p.citizenLocation?.lat || 0,
                        lng: p.citizenLocation?.lng || 0,
                        address: p.citizenLocation?.address,
                        status: p.status,
                    }))} />
                </View>
            )}

            {/* Pending Requests */}
            <SectionHeader title="Incoming Requests" />
            {pendingRequests.length === 0 ? (
                <View style={{ padding: 20, alignItems: 'center' }}>
                    <Text style={{ color: Colors.textSecondary }}>No pending requests</Text>
                </View>
            ) : (
                pendingRequests.map((p) => (
                    <View key={p._id} style={{ marginHorizontal: 16, marginBottom: 8 }}>
                        <PickupCard pickup={p} onPress={() => router.push(`/(kabadiwalla)/confirm/${p._id}` as any)} />
                        <Pressable onPress={() => handleAccept(p._id)} style={{ backgroundColor: Colors.secondary[600], paddingVertical: 10, borderRadius: 8, alignItems: 'center', marginTop: 4 }}>
                            <Text style={{ color: Colors.white, fontWeight: '600' }}>Accept</Text>
                        </Pressable>
                    </View>
                ))
            )}

            {/* Today's Route */}
            <SectionHeader title="Today's Route" />
            {todayRoute.length === 0 ? (
                <EmptyState icon="map-outline" title="No pickups yet" subtitle="Accept incoming requests to build today's route" />
            ) : (
                todayRoute.map((p) => (
                    <PickupCard key={p._id} pickup={p} onPress={() => router.push(`/(kabadiwalla)/confirm/${p._id}` as any)} />
                ))
            )}
        </ScrollView>
    );
}
