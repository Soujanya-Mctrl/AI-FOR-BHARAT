import { Colors } from '@/constants/colors';
import React from 'react';
import { Text, View } from 'react-native';

interface TrustScoreBadgeProps {
    score: number;
}

export function TrustScoreBadge({ score }: TrustScoreBadgeProps) {
    const getConfig = () => {
        if (score >= 80) return { label: 'High Trust', bg: Colors.success.light, text: Colors.success.dark, icon: '🛡️' };
        if (score >= 50) return { label: 'Medium Trust', bg: Colors.warning.light, text: Colors.warning.dark, icon: '⚡' };
        return { label: 'New', bg: Colors.neutral[200], text: Colors.neutral[700], icon: '🌱' };
    };

    const { label, bg, text, icon } = getConfig();

    return (
        <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: bg, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, gap: 4 }}>
            <Text style={{ fontSize: 12 }}>{icon}</Text>
            <Text style={{ color: text, fontSize: 11, fontWeight: '600' }}>{label}</Text>
        </View>
    );
}
