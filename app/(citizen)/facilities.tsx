import { EmptyState } from '@/components/shared/EmptyState';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Colors } from '@/constants/colors';
import { facilityService } from '@/services/facility.service';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

export default function FacilitiesScreen() {
    const [facilities, setFacilities] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

    useEffect(() => {
        (async () => {
            try {
                const data = await facilityService.getFacilities();
                setFacilities(data.facilities || []);
            } catch { } finally { setLoading(false); }
        })();
    }, []);

    if (loading) return <LoadingSpinner message="Loading facilities..." />;

    return (
        <ScrollView style={{ flex: 1, backgroundColor: Colors.background }} contentContainerStyle={{ paddingBottom: 100 }}>
            <View style={{ paddingTop: 60, paddingHorizontal: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ fontSize: 24, fontWeight: '800', color: Colors.text }}>Facilities</Text>
                <View style={{ flexDirection: 'row', gap: 8 }}>
                    <Pressable onPress={() => setViewMode('list')} style={{ padding: 8, backgroundColor: viewMode === 'list' ? Colors.primary[100] : Colors.neutral[100], borderRadius: 8 }}>
                        <Ionicons name="list" size={18} color={viewMode === 'list' ? Colors.primary[700] : Colors.neutral[500]} />
                    </Pressable>
                    <Pressable onPress={() => setViewMode('map')} style={{ padding: 8, backgroundColor: viewMode === 'map' ? Colors.primary[100] : Colors.neutral[100], borderRadius: 8 }}>
                        <Ionicons name="map-outline" size={18} color={viewMode === 'map' ? Colors.primary[700] : Colors.neutral[500]} />
                    </Pressable>
                </View>
            </View>

            {facilities.length === 0 ? (
                <EmptyState icon="business-outline" title="No facilities found" subtitle="Try expanding your search area" />
            ) : (
                facilities.map((f, i) => (
                    <View key={i} style={{ margin: 16, marginBottom: 8, backgroundColor: Colors.white, borderRadius: 12, padding: 16 }}>
                        <Text style={{ fontSize: 16, fontWeight: '600', color: Colors.text }}>{f.state}</Text>
                        <Text style={{ fontSize: 13, color: Colors.textSecondary, marginTop: 2 }}>{f.total} recyclers</Text>
                        {f.recyclers?.slice(0, 3).map((r: any, j: number) => (
                            <View key={j} style={{ marginTop: 8, paddingTop: 8, borderTopWidth: j > 0 ? 1 : 0, borderTopColor: Colors.neutral[100] }}>
                                <Text style={{ fontSize: 14, fontWeight: '500', color: Colors.text }}>{r.name}</Text>
                                <Text style={{ fontSize: 12, color: Colors.textSecondary }}>{r.address}</Text>
                            </View>
                        ))}
                    </View>
                ))
            )}
        </ScrollView>
    );
}
