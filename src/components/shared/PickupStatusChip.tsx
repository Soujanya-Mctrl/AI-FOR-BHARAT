import { Colors } from '@/constants/colors';
import type { PickupStatus } from '@/types/pickup.types';
import React from 'react';
import { Text, View } from 'react-native';

interface PickupStatusChipProps {
    status: PickupStatus;
}

const statusConfig: Record<PickupStatus, { label: string; bg: string; text: string }> = {
    requested: { label: 'Requested', bg: '#dbeafe', text: '#1d4ed8' },
    accepted: { label: 'Accepted', bg: '#ede9fe', text: '#6d28d9' },
    arriving: { label: 'Arriving', bg: '#fed7aa', text: '#c2410c' },
    confirmed: { label: 'Confirmed', bg: '#ccfbf1', text: '#0f766e' },
    completed: { label: 'Completed', bg: Colors.success.light, text: Colors.success.dark },
    cancelled: { label: 'Cancelled', bg: Colors.neutral[200], text: Colors.neutral[600] },
};

export function PickupStatusChip({ status }: PickupStatusChipProps) {
    const config = statusConfig[status] || statusConfig.requested;
    return (
        <View style={{ backgroundColor: config.bg, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 }}>
            <Text style={{ color: config.text, fontSize: 12, fontWeight: '600' }}>{config.label}</Text>
        </View>
    );
}
