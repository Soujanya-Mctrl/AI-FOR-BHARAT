import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Colors } from '@/constants/colors';
import { useAuth } from '@/hooks/useAuth';
import { municipalityService } from '@/services/municipality.service';
import type { DashboardMetrics, StreetCompliance } from '@/types/api.types';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Pressable, RefreshControl, ScrollView, Text, View } from 'react-native';

export default function MunicipalityDashboard() {
    const { logout } = useAuth();
    const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
    const [streets, setStreets] = useState<StreetCompliance[]>([]);
    const [alerts, setAlerts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchData = async () => {
        try {
            const data = await municipalityService.getDashboard();
            setMetrics(data.metrics);
            setStreets(data.streets || []);
            setAlerts(data.alerts || []);
        } catch { } finally { setLoading(false); setRefreshing(false); }
    };

    useEffect(() => { fetchData(); }, []);

    if (loading) return <LoadingSpinner message="Loading dashboard..." />;

    const MetricCard = ({ label, value, change, icon }: { label: string; value: string; change?: number; icon: string }) => (
        <View style={{ flex: 1, backgroundColor: Colors.white, borderRadius: 12, padding: 14 }}>
            <Ionicons name={icon as any} size={20} color={Colors.primary[600]} />
            <Text style={{ fontSize: 22, fontWeight: '700', color: Colors.text, marginTop: 8 }}>{value}</Text>
            <Text style={{ fontSize: 12, color: Colors.textSecondary, marginTop: 2 }}>{label}</Text>
            {change !== undefined && (
                <Text style={{ fontSize: 11, color: change >= 0 ? Colors.success.DEFAULT : Colors.error.DEFAULT, marginTop: 2 }}>
                    {change >= 0 ? '↑' : '↓'} {Math.abs(change)}%
                </Text>
            )}
        </View>
    );

    return (
        <ScrollView
            style={{ flex: 1, backgroundColor: Colors.background }}
            contentContainerStyle={{ paddingBottom: 100 }}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchData(); }} />}
        >
            <View style={{ paddingTop: 60, paddingHorizontal: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View>
                    <Text style={{ fontSize: 24, fontWeight: '800', color: Colors.text }}>Ward Dashboard</Text>
                    <Text style={{ fontSize: 13, color: Colors.textSecondary }}>Municipality Overview</Text>
                </View>
                <Pressable onPress={logout} style={{ padding: 8 }}>
                    <Ionicons name="log-out-outline" size={24} color={Colors.neutral[500]} />
                </Pressable>
            </View>

            {/* Metrics */}
            <View style={{ flexDirection: 'row', gap: 8, margin: 16, flexWrap: 'wrap' }}>
                <MetricCard label="Verified Pickups" value={String(metrics?.totalVerifiedPickups || 0)} change={metrics?.totalVerifiedPickupsChange} icon="checkmark-circle-outline" />
                <MetricCard label="Avg Quality" value={`${metrics?.averageQualityScore || 0}%`} change={metrics?.averageQualityScoreChange} icon="analytics-outline" />
            </View>
            <View style={{ flexDirection: 'row', gap: 8, marginHorizontal: 16, marginBottom: 16 }}>
                <MetricCard label="Compliance" value={`${metrics?.complianceRate || 0}%`} change={metrics?.complianceRateChange} icon="shield-checkmark-outline" />
                <MetricCard label="Active Kabadiwallas" value={String(metrics?.activeKabadiwallas || 0)} icon="people-outline" />
            </View>

            {/* Alerts */}
            {alerts.length > 0 && (
                <View style={{ marginHorizontal: 16, marginBottom: 16 }}>
                    {alerts.slice(0, 3).map((alert, i) => (
                        <View key={i} style={{ backgroundColor: alert.severity === 'high' ? Colors.error.light : Colors.warning.light, borderRadius: 8, padding: 12, marginBottom: 6 }}>
                            <Text style={{ fontSize: 13, color: alert.severity === 'high' ? Colors.error.dark : Colors.warning.dark }}>{alert.message}</Text>
                        </View>
                    ))}
                </View>
            )}

            {/* Navigation */}
            <View style={{ margin: 16, gap: 8 }}>
                <Pressable onPress={() => router.push('/(municipality)/reports')} style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.white, borderRadius: 12, padding: 16, gap: 12 }}>
                    <Ionicons name="document-text-outline" size={22} color={Colors.primary[600]} />
                    <Text style={{ flex: 1, fontSize: 15, color: Colors.text }}>Verified Reports</Text>
                    <Ionicons name="chevron-forward" size={18} color={Colors.neutral[400]} />
                </Pressable>
                <Pressable onPress={() => router.push('/(municipality)/analytics')} style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.white, borderRadius: 12, padding: 16, gap: 12 }}>
                    <Ionicons name="bar-chart-outline" size={22} color={Colors.primary[600]} />
                    <Text style={{ flex: 1, fontSize: 15, color: Colors.text }}>Analytics</Text>
                    <Ionicons name="chevron-forward" size={18} color={Colors.neutral[400]} />
                </Pressable>
            </View>
        </ScrollView>
    );
}
