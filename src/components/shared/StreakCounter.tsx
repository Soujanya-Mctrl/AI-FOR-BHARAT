import { Colors } from '@/constants/colors';
import React, { useEffect, useRef } from 'react';
import { Animated, Text, View } from 'react-native';

interface StreakCounterProps {
    count: number;
}

export function StreakCounter({ count }: StreakCounterProps) {
    const pulse = useRef(new Animated.Value(1)).current;
    const isMilestone = count === 7 || count === 30 || count === 90;

    useEffect(() => {
        if (isMilestone) {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(pulse, { toValue: 1.15, duration: 600, useNativeDriver: true }),
                    Animated.timing(pulse, { toValue: 1, duration: 600, useNativeDriver: true }),
                ])
            ).start();
        }
    }, [isMilestone]);

    const getMilestoneMessage = () => {
        if (count >= 90) return '🏆 Incredible! 90-day legend!';
        if (count >= 30) return '🌟 Amazing! 30-day warrior!';
        if (count >= 7) return '🔥 Great! 7-day streak!';
        return '';
    };

    return (
        <Animated.View style={{
            transform: [{ scale: pulse }],
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            backgroundColor: Colors.white,
            borderRadius: 12,
            paddingHorizontal: 16,
            paddingVertical: 10,
        }}>
            <Text style={{ fontSize: 24 }}>🔥</Text>
            <View>
                <Text style={{ fontSize: 20, fontWeight: '700', color: Colors.text }}>
                    {count} <Text style={{ fontSize: 14, fontWeight: '500', color: Colors.textSecondary }}>day streak</Text>
                </Text>
                {isMilestone && (
                    <Text style={{ fontSize: 12, color: Colors.primary[600], fontWeight: '600', marginTop: 2 }}>
                        {getMilestoneMessage()}
                    </Text>
                )}
            </View>
        </Animated.View>
    );
}
