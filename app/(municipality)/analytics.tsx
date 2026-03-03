import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { ComplianceChart } from '@/components/web/ComplianceChart';
import { Colors } from '@/constants/colors';
import { municipalityService } from '@/services/municipality.service';
import React, { useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';

export default function AnalyticsScreen() {
    const [analytics, setAnalytics] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const data = await municipalityService.getAnalytics();
                setAnalytics(data);
            } catch { } finally { setLoading(false); }
        })();
    }, []);

    if (loading) return <LoadingSpinner message="Loading analytics..." />;

    return (
        <ScrollView style={{ flex: 1, backgroundColor: Colors.background }} contentContainerStyle={{ padding: 16, paddingTop: 60, paddingBottom: 100, gap: 16 }}>
            <Text style={{ fontSize: 24, fontWeight: '800', color: Colors.text }}>Analytics</Text>

            {analytics?.weeklyPickups && (
                <ComplianceChart data={analytics.weeklyPickups.map((d: any) => ({ label: d.date?.slice(5, 10) ?? '', value: d.value ?? 0 }))} type="bar" title="Weekly Pickups" />
            )}

            {analytics?.complianceTrend && (
                <ComplianceChart data={analytics.complianceTrend.map((d: any) => ({ label: d.date?.slice(5, 10) ?? '', value: d.value ?? 0 }))} type="line" title="Compliance Trend" />
            )}

            {analytics?.qualityDistribution && (
                <ComplianceChart data={analytics.qualityDistribution.map((d: any) => ({ label: d.label ?? '', value: d.count ?? 0 }))} type="bar" title="Quality Distribution" />
            )}

            {/* Top/Bottom Streets */}
            {analytics?.topStreets && analytics.topStreets.length > 0 && (
                <View style={{ backgroundColor: Colors.white, borderRadius: 12, padding: 16 }}>
                    <Text style={{ fontSize: 16, fontWeight: '600', color: Colors.text, marginBottom: 12 }}>Top Streets</Text>
                    {analytics.topStreets.map((s: any, i: number) => (
                        <View key={i} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: Colors.neutral[100] }}>
                            <Text style={{ color: Colors.text }}>{s.street}</Text>
                            <Text style={{ color: Colors.success.DEFAULT, fontWeight: '600' }}>{s.complianceRate}%</Text>
                        </View>
                    ))}
                </View>
            )}
        </ScrollView>
    );
}
