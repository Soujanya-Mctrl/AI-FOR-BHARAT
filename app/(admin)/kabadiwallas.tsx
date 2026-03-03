import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { TrustScoreBadge } from '@/components/shared/TrustScoreBadge';
import { Colors } from '@/constants/colors';
import api from '@/services/api';
import type { User } from '@/types/user.types';
import React, { useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';

export default function KabadiwallasScreen() {
    const [kabadiwallas, setKabadiwallas] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const { data } = await api.get('/api/admin/kabadiwallas');
                setKabadiwallas(data.data || data.kabadiwallas || []);
            } catch { } finally { setLoading(false); }
        })();
    }, []);

    if (loading) return <LoadingSpinner message="Loading kabadiwallas..." />;

    return (
        <ScrollView style={{ flex: 1, backgroundColor: Colors.background }} contentContainerStyle={{ paddingBottom: 100 }}>
            <View style={{ paddingTop: 60, paddingHorizontal: 20 }}>
                <Text style={{ fontSize: 24, fontWeight: '800', color: Colors.text }}>Kabadiwalla Directory</Text>
                <Text style={{ fontSize: 13, color: Colors.textSecondary, marginTop: 2 }}>{kabadiwallas.length} registered</Text>
            </View>

            {kabadiwallas.map((k) => (
                <View key={k._id} style={{ margin: 16, marginBottom: 8, backgroundColor: Colors.white, borderRadius: 12, padding: 16 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <View>
                            <Text style={{ fontSize: 16, fontWeight: '600', color: Colors.text }}>{k.username}</Text>
                            <Text style={{ fontSize: 13, color: Colors.textSecondary, marginTop: 2 }}>{k.email}</Text>
                        </View>
                        <TrustScoreBadge score={k.reliabilityScore} />
                    </View>
                    <View style={{ flexDirection: 'row', gap: 16, marginTop: 12 }}>
                        <View>
                            <Text style={{ fontSize: 12, color: Colors.textSecondary }}>Pickups</Text>
                            <Text style={{ fontSize: 15, fontWeight: '600', color: Colors.text }}>{k.kabadiwalaProfile?.totalConfirmedPickups ?? 0}</Text>
                        </View>
                        <View>
                            <Text style={{ fontSize: 12, color: Colors.textSecondary }}>Accuracy</Text>
                            <Text style={{ fontSize: 15, fontWeight: '600', color: Colors.text }}>{k.kabadiwalaProfile?.accuracyScore ?? 0}%</Text>
                        </View>
                        <View>
                            <Text style={{ fontSize: 12, color: Colors.textSecondary }}>On-Time</Text>
                            <Text style={{ fontSize: 15, fontWeight: '600', color: Colors.text }}>{k.kabadiwalaProfile?.onTimeArrivalRate ?? 0}%</Text>
                        </View>
                        <View>
                            <Text style={{ fontSize: 12, color: Colors.textSecondary }}>Verified</Text>
                            <Text style={{ fontSize: 15, fontWeight: '600', color: k.kabadiwalaProfile?.isVerified ? Colors.success.DEFAULT : Colors.error.DEFAULT }}>
                                {k.kabadiwalaProfile?.isVerified ? '✓' : '✕'}
                            </Text>
                        </View>
                    </View>
                </View>
            ))}
        </ScrollView>
    );
}
