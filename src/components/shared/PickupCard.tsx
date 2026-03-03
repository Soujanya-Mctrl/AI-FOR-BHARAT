import { Colors } from '@/constants/colors';
import type { PickupRequest } from '@/types/pickup.types';
import { formatScore, formatTimeAgo } from '@/utils/formatters';
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { PickupStatusChip } from './PickupStatusChip';

interface PickupCardProps {
    pickup: PickupRequest;
    onPress?: () => void;
}

export function PickupCard({ pickup, onPress }: PickupCardProps) {
    return (
        <Pressable
            onPress={onPress}
            style={{
                backgroundColor: Colors.white,
                borderRadius: 12,
                padding: 16,
                marginHorizontal: 16,
                marginVertical: 6,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.08,
                shadowRadius: 4,
                elevation: 2,
            }}
        >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 14, fontWeight: '600', color: Colors.text }} numberOfLines={1}>
                        {pickup.citizenLocation?.address || 'Pickup Location'}
                    </Text>
                    <Text style={{ fontSize: 12, color: Colors.textSecondary, marginTop: 4 }}>
                        {formatTimeAgo(pickup.createdAt)}
                    </Text>
                </View>
                <PickupStatusChip status={pickup.status} />
            </View>
            {pickup.crossReferenceResult && (
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10, gap: 8 }}>
                    <Text style={{ fontSize: 12, color: Colors.textSecondary }}>Quality Score:</Text>
                    <Text style={{ fontSize: 13, fontWeight: '600', color: Colors.primary[700] }}>
                        {formatScore(pickup.crossReferenceResult.compositeScore)}
                    </Text>
                </View>
            )}
        </Pressable>
    );
}
