import { MapPickupView } from '@/components/native/MapPickupView';
import { EmptyState } from '@/components/shared/EmptyState';
import { KabadiwalaCard } from '@/components/shared/KabadiwalaCard';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { Colors } from '@/constants/colors';
import { useLocation } from '@/hooks/useLocation';
import { pickupService } from '@/services/pickup.service';
import { usePickupStore } from '@/stores/pickupStore';
import { useUIStore } from '@/stores/uiStore';
import type { NearbyKabadiwalla } from '@/types/user.types';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';

export default function PickupScreen() {
    const { currentLocation, isLoading: locLoading } = useLocation();
    const [loading, setLoading] = useState(true);
    const { nearbyKabadiwallas, setNearbyKabadiwallas } = usePickupStore();
    const showToast = useUIStore((s) => s.showToast);

    const fetchNearby = async () => {
        if (!currentLocation) return;
        setLoading(true);
        try {
            const results = await pickupService.getNearbyKabadiwallas(currentLocation.lat, currentLocation.lng);
            setNearbyKabadiwallas(results);
        } catch {
            // Empty state will show
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (currentLocation) fetchNearby();
    }, [currentLocation]);

    const handleRequest = async (kabadiwalla: NearbyKabadiwalla) => {
        if (!currentLocation) return;
        try {
            const pickup = await pickupService.requestPickup({
                kabadiwalaId: kabadiwalla._id,
                scheduledWindow: {
                    start: new Date().toISOString(),
                    end: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
                },
                citizenLocation: { lat: currentLocation.lat, lng: currentLocation.lng },
            });
            showToast('Pickup requested!', 'success');
            router.push(`/(citizen)/pickup/${pickup._id}` as any);
        } catch {
            showToast('Failed to request pickup', 'error');
        }
    };

    if (locLoading || loading) return <LoadingSpinner message="Finding nearby kabadiwallas..." />;

    return (
        <ScrollView style={{ flex: 1, backgroundColor: Colors.background }}>
            <View style={{ paddingTop: 50, paddingHorizontal: 16 }}>
                <Text style={{ fontSize: 24, fontWeight: '800', color: Colors.text }}>Request Pickup</Text>
                <Text style={{ fontSize: 14, color: Colors.textSecondary, marginTop: 4 }}>Find a kabadiwalla near you</Text>
            </View>

            <View style={{ margin: 16 }}>
                <MapPickupView
                    kabadiwallas={nearbyKabadiwallas.map((k) => ({ lat: 0, lng: 0, username: k.username, reliabilityScore: k.reliabilityScore }))}
                    citizenLocation={currentLocation || undefined}
                />
            </View>

            <SectionHeader title={`${nearbyKabadiwallas.length} Kabadiwallas Available`} />

            {nearbyKabadiwallas.length === 0 ? (
                <EmptyState icon="people-outline" title="No kabadiwallas nearby" subtitle="We're growing! You'll be notified when one joins your area." />
            ) : (
                nearbyKabadiwallas.map((k) => (
                    <KabadiwalaCard key={k._id} kabadiwalla={k} onRequest={() => handleRequest(k)} />
                ))
            )}

            <View style={{ height: 100 }} />
        </ScrollView>
    );
}
