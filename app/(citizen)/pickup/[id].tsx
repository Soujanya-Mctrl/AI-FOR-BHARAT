import { CashbackBadge } from '@/components/shared/CashbackBadge';
import { ErrorState } from '@/components/shared/ErrorState';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { PickupStatusChip } from '@/components/shared/PickupStatusChip';
import { RatingStars } from '@/components/shared/RatingStars';
import { Colors } from '@/constants/colors';
import { Config } from '@/constants/config';
import { pickupService } from '@/services/pickup.service';
import type { PickupRequest } from '@/types/pickup.types';
import { formatScore, formatTimeAgo } from '@/utils/formatters';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';

export default function PickupDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const [pickup, setPickup] = useState<PickupRequest | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [rating, setRating] = useState(0);

    const fetchPickup = async () => {
        if (!id) return;
        setLoading(true);
        try {
            const data = await pickupService.getPickupById(id);
            setPickup(data);
        } catch {
            setError('Failed to load pickup details');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPickup();
        // Poll for status updates
        const interval = setInterval(fetchPickup, Config.PICKUP_STATUS_POLL_INTERVAL_MS);
        return () => clearInterval(interval);
    }, [id]);

    const handleRate = async (value: number) => {
        setRating(value);
        if (!id) return;
        try {
            await pickupService.ratePickup(id, value);
            fetchPickup();
        } catch { }
    };

    if (loading) return <LoadingSpinner message="Loading pickup..." />;
    if (error || !pickup) return <ErrorState message={error || 'Pickup not found'} onRetry={fetchPickup} />;

    const showRating = pickup.status === 'confirmed' && !pickup.citizenRating;

    return (
        <ScrollView style={{ flex: 1, backgroundColor: Colors.background }} contentContainerStyle={{ padding: 24, paddingTop: 60 }}>
            <Text style={{ fontSize: 22, fontWeight: '700', color: Colors.text }}>Pickup Tracking</Text>

            <View style={{ marginTop: 16, alignItems: 'center' }}>
                <PickupStatusChip status={pickup.status} />
                <Text style={{ marginTop: 8, color: Colors.textSecondary }}>{formatTimeAgo(pickup.createdAt)}</Text>
            </View>

            {/* Status timeline */}
            <View style={{ marginTop: 24, backgroundColor: Colors.white, borderRadius: 16, padding: 20 }}>
                {['requested', 'accepted', 'arriving', 'confirmed', 'completed'].map((s, i) => {
                    const isActive = ['requested', 'accepted', 'arriving', 'confirmed', 'completed'].indexOf(pickup.status) >= i;
                    return (
                        <View key={s} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: i < 4 ? 16 : 0 }}>
                            <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: isActive ? Colors.primary[600] : Colors.neutral[200], justifyContent: 'center', alignItems: 'center' }}>
                                {isActive && <Text style={{ color: Colors.white, fontSize: 12, fontWeight: '700' }}>✓</Text>}
                            </View>
                            <Text style={{ marginLeft: 12, fontSize: 14, color: isActive ? Colors.text : Colors.neutral[400], fontWeight: isActive ? '600' : '400', textTransform: 'capitalize' }}>{s}</Text>
                        </View>
                    );
                })}
            </View>

            {/* Rating */}
            {showRating && (
                <View style={{ marginTop: 24, backgroundColor: Colors.white, borderRadius: 16, padding: 20, alignItems: 'center' }}>
                    <Text style={{ fontSize: 16, fontWeight: '600', color: Colors.text, marginBottom: 12 }}>Rate your kabadiwalla</Text>
                    <RatingStars value={rating} onChange={handleRate} size={36} />
                </View>
            )}

            {/* Results */}
            {pickup.crossReferenceResult && (
                <View style={{ marginTop: 24, backgroundColor: Colors.white, borderRadius: 16, padding: 20, alignItems: 'center' }}>
                    <Text style={{ fontSize: 14, color: Colors.textSecondary }}>Quality Score</Text>
                    <Text style={{ fontSize: 32, fontWeight: '800', color: Colors.primary[700], marginTop: 4 }}>
                        {formatScore(pickup.crossReferenceResult.compositeScore)}
                    </Text>
                    {pickup.cashbackAmount !== undefined && pickup.cashbackAmount > 0 && (
                        <View style={{ marginTop: 12 }}>
                            <CashbackBadge amount={pickup.cashbackAmount} />
                        </View>
                    )}
                </View>
            )}
        </ScrollView>
    );
}
