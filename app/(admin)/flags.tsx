import { EmptyState } from '@/components/shared/EmptyState';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Colors } from '@/constants/colors';
import api from '@/services/api';
import type { AnomalyFlag } from '@/types/api.types';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

const flagTypeConfig: Record<string, { color: string; icon: string; label: string }> = {
    gps_spoof: { color: Colors.error.DEFAULT, icon: 'location-outline', label: 'GPS Spoof' },
    rating_inflation: { color: Colors.warning.DEFAULT, icon: 'star-outline', label: 'Rating Inflation' },
    impossible_route: { color: Colors.error.DEFAULT, icon: 'map-outline', label: 'Impossible Route' },
    velocity_attack: { color: '#7c3aed', icon: 'speedometer-outline', label: 'Velocity Attack' },
    collusion: { color: '#dc2626', icon: 'people-outline', label: 'Collusion' },
    new_account_abuse: { color: Colors.warning.dark, icon: 'person-add-outline', label: 'New Account Abuse' },
};

export default function FlagsScreen() {
    const [flags, setFlags] = useState<AnomalyFlag[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const { data } = await api.get('/api/admin/flags');
                setFlags(data.data || data.flags || []);
            } catch { } finally { setLoading(false); }
        })();
    }, []);

    const handleAction = async (id: string, action: 'dismissed' | 'investigating' | 'suspended') => {
        try {
            await api.patch(`/api/admin/flags/${id}`, { status: action });
            setFlags((prev) => prev.map((f) => f._id === id ? { ...f, status: action } : f));
        } catch { }
    };

    if (loading) return <LoadingSpinner message="Loading flags..." />;

    return (
        <ScrollView style={{ flex: 1, backgroundColor: Colors.background }} contentContainerStyle={{ paddingBottom: 100 }}>
            <View style={{ paddingTop: 60, paddingHorizontal: 20 }}>
                <Text style={{ fontSize: 24, fontWeight: '800', color: Colors.text }}>Anomaly Flags</Text>
                <Text style={{ fontSize: 13, color: Colors.textSecondary, marginTop: 2 }}>{flags.filter((f) => f.status === 'pending').length} pending review</Text>
            </View>

            {flags.length === 0 ? (
                <EmptyState icon="shield-checkmark-outline" title="No flagged accounts" subtitle="The system automatically detects anomalies" />
            ) : (
                flags.map((flag) => {
                    const config = flagTypeConfig[flag.flagType] || flagTypeConfig.gps_spoof;
                    return (
                        <View key={flag._id} style={{ margin: 16, marginBottom: 8, backgroundColor: Colors.white, borderRadius: 12, padding: 16, borderLeftWidth: 4, borderLeftColor: config.color }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                                <Ionicons name={config.icon as any} size={18} color={config.color} />
                                <Text style={{ fontSize: 13, fontWeight: '600', color: config.color }}>{config.label}</Text>
                                <View style={{ flex: 1 }} />
                                <View style={{ backgroundColor: flag.status === 'pending' ? Colors.warning.light : Colors.neutral[200], paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 }}>
                                    <Text style={{ fontSize: 11, color: flag.status === 'pending' ? Colors.warning.dark : Colors.neutral[600] }}>{flag.status}</Text>
                                </View>
                            </View>
                            <Text style={{ fontSize: 15, fontWeight: '600', color: Colors.text, marginTop: 8 }}>{flag.userName}</Text>
                            <Text style={{ fontSize: 13, color: Colors.textSecondary, marginTop: 4 }}>{flag.evidenceSummary}</Text>

                            {flag.status === 'pending' && (
                                <View style={{ flexDirection: 'row', gap: 8, marginTop: 12 }}>
                                    <Pressable onPress={() => handleAction(flag._id, 'dismissed')} style={{ flex: 1, paddingVertical: 8, borderRadius: 6, borderWidth: 1, borderColor: Colors.border, alignItems: 'center' }}>
                                        <Text style={{ fontSize: 13, color: Colors.textSecondary }}>Dismiss</Text>
                                    </Pressable>
                                    <Pressable onPress={() => handleAction(flag._id, 'investigating')} style={{ flex: 1, paddingVertical: 8, borderRadius: 6, backgroundColor: Colors.warning.light, alignItems: 'center' }}>
                                        <Text style={{ fontSize: 13, color: Colors.warning.dark, fontWeight: '600' }}>Investigate</Text>
                                    </Pressable>
                                    <Pressable onPress={() => handleAction(flag._id, 'suspended')} style={{ flex: 1, paddingVertical: 8, borderRadius: 6, backgroundColor: Colors.error.light, alignItems: 'center' }}>
                                        <Text style={{ fontSize: 13, color: Colors.error.dark, fontWeight: '600' }}>Suspend</Text>
                                    </Pressable>
                                </View>
                            )}
                        </View>
                    );
                })
            )}
        </ScrollView>
    );
}
