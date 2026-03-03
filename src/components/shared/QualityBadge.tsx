import { Colors } from '@/constants/colors';
import React from 'react';
import { Text, View } from 'react-native';

interface QualityBadgeProps {
    quality: 'good' | 'acceptable' | 'poor';
}

const config = {
    good: { label: 'Good', bg: Colors.success.light, text: Colors.success.dark },
    acceptable: { label: 'Acceptable', bg: Colors.warning.light, text: Colors.warning.dark },
    poor: { label: 'Poor', bg: Colors.error.light, text: Colors.error.dark },
};

export function QualityBadge({ quality }: QualityBadgeProps) {
    const { label, bg, text } = config[quality];
    return (
        <View style={{ backgroundColor: bg, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 }}>
            <Text style={{ color: text, fontSize: 12, fontWeight: '600' }}>{label}</Text>
        </View>
    );
}
