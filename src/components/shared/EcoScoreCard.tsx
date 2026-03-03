import { Colors } from '@/constants/colors';
import React from 'react';
import { Text, View } from 'react-native';

interface EcoScoreCardProps {
    score: number;
    label?: string;
    trend?: 'up' | 'down' | 'stable';
    trendValue?: number;
    size?: 'small' | 'large';
}

export function EcoScoreCard({ score, label = 'EcoScore', trend, trendValue, size = 'large' }: EcoScoreCardProps) {
    const radius = size === 'large' ? 50 : 30;
    const strokeWidth = size === 'large' ? 8 : 5;
    const fontSize = size === 'large' ? 28 : 16;

    const getColor = () => {
        if (score >= 70) return Colors.success.DEFAULT;
        if (score >= 40) return Colors.warning.DEFAULT;
        return Colors.error.DEFAULT;
    };

    const trendArrow = trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→';
    const trendColor = trend === 'up' ? Colors.success.DEFAULT : trend === 'down' ? Colors.error.DEFAULT : Colors.neutral[500];

    return (
        <View style={{
            alignItems: 'center',
            backgroundColor: Colors.white,
            borderRadius: 16,
            padding: size === 'large' ? 20 : 12,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 3,
        }}>
            <View style={{
                width: radius * 2 + strokeWidth,
                height: radius * 2 + strokeWidth,
                borderRadius: radius + strokeWidth,
                borderWidth: strokeWidth,
                borderColor: Colors.neutral[200],
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
            }}>
                <View style={{
                    position: 'absolute',
                    width: radius * 2 + strokeWidth,
                    height: radius * 2 + strokeWidth,
                    borderRadius: radius + strokeWidth,
                    borderWidth: strokeWidth,
                    borderColor: getColor(),
                    borderLeftColor: 'transparent',
                    borderBottomColor: score < 50 ? 'transparent' : getColor(),
                    transform: [{ rotate: '-45deg' }],
                }} />
                <Text style={{ fontSize, fontWeight: '700', color: getColor() }}>
                    {Math.round(score)}
                </Text>
            </View>
            <Text style={{ marginTop: 8, fontSize: 14, fontWeight: '600', color: Colors.text }}>
                {label}
            </Text>
            {trend && (
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                    <Text style={{ color: trendColor, fontSize: 14, fontWeight: '600' }}>
                        {trendArrow} {trendValue ? `${trendValue}%` : ''}
                    </Text>
                    <Text style={{ color: Colors.textSecondary, fontSize: 12, marginLeft: 4 }}>vs last week</Text>
                </View>
            )}
        </View>
    );
}
