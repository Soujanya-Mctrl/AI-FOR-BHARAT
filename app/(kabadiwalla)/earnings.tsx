import { EcoScoreCard } from '@/components/shared/EcoScoreCard';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { QualityBadge } from '@/components/shared/QualityBadge';
import { Colors } from '@/constants/colors';
import { userService } from '@/services/user.service';
import type { EarningsSummary } from '@/types/api.types';
import { formatINR } from '@/utils/formatters';
import React, { useEffect, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

export default function EarningsScreen() {
    const [earnings, setEarnings] = useState<EarningsSummary | null>(null);
    const [period, setPeriod] = useState<'today' | 'week' | 'month'>('week');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            setLoading(true);
            try {
                const data = await userService.getEarnings(period);
                setEarnings(data);
            } catch { } finally { setLoading(false); }
        })();
    }, [period]);

    if (loading) return <LoadingSpinner message="Loading earnings..." />;

    return (
        <ScrollView style={{ flex: 1, backgroundColor: Colors.background }} contentContainerStyle={{ paddingBottom: 100 }}>
            <View style={{ paddingTop: 60, paddingHorizontal: 20 }}>
                <Text style={{ fontSize: 24, fontWeight: '800', color: Colors.text }}>Earnings</Text>
            </View>

            {/* Period Selector */}
            <View style={{ flexDirection: 'row', marginHorizontal: 16, marginTop: 16, backgroundColor: Colors.neutral[100], borderRadius: 10, padding: 4 }}>
                {(['today', 'week', 'month'] as const).map((p) => (
                    <Pressable key={p} onPress={() => setPeriod(p)} style={{ flex: 1, paddingVertical: 10, borderRadius: 8, alignItems: 'center', backgroundColor: period === p ? Colors.white : 'transparent' }}>
                        <Text style={{ fontSize: 14, fontWeight: period === p ? '600' : '400', color: period === p ? Colors.text : Colors.textSecondary, textTransform: 'capitalize' }}>{p}</Text>
                    </Pressable>
                ))}
            </View>

            {earnings && (
                <>
                    {/* Total */}
                    <View style={{ margin: 16, backgroundColor: Colors.white, borderRadius: 16, padding: 24, alignItems: 'center' }}>
                        <Text style={{ fontSize: 14, color: Colors.textSecondary }}>Total Earned</Text>
                        <Text style={{ fontSize: 36, fontWeight: '800', color: Colors.text, marginTop: 4 }}>{formatINR(earnings.totalEarned)}</Text>
                        <Text style={{ fontSize: 13, color: Colors.textSecondary, marginTop: 4 }}>{earnings.totalPickups} pickups</Text>
                    </View>

                    {/* Quality Score */}
                    <View style={{ marginHorizontal: 16 }}>
                        <EcoScoreCard score={earnings.avgQualityScore} label="Avg Quality Score" size="small" />
                    </View>

                    {/* Breakdown */}
                    <View style={{ margin: 16, backgroundColor: Colors.white, borderRadius: 16, padding: 20 }}>
                        <Text style={{ fontSize: 16, fontWeight: '600', color: Colors.text, marginBottom: 12 }}>Quality Breakdown</Text>
                        {[
                            { label: 'Good', count: earnings.qualityBreakdown.good, quality: 'good' as const },
                            { label: 'Acceptable', count: earnings.qualityBreakdown.acceptable, quality: 'acceptable' as const },
                            { label: 'Poor', count: earnings.qualityBreakdown.poor, quality: 'poor' as const },
                        ].map((item) => (
                            <View key={item.label} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: Colors.neutral[100] }}>
                                <QualityBadge quality={item.quality} />
                                <Text style={{ fontWeight: '600', color: Colors.text }}>{item.count}</Text>
                            </View>
                        ))}
                    </View>
                </>
            )}
        </ScrollView>
    );
}
