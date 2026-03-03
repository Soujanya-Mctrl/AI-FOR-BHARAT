import { Colors } from '@/constants/colors';
import { formatINR } from '@/utils/formatters';
import React, { useEffect, useRef } from 'react';
import { Animated, Text } from 'react-native';

interface CashbackBadgeProps {
    amount: number;
    pending?: boolean;
}

export function CashbackBadge({ amount, pending = false }: CashbackBadgeProps) {
    const scale = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.spring(scale, {
            toValue: 1,
            tension: 100,
            friction: 8,
            useNativeDriver: true,
        }).start();
    }, []);

    return (
        <Animated.View style={{
            transform: [{ scale }],
            backgroundColor: pending ? Colors.neutral[200] : Colors.success.light,
            borderRadius: 16,
            paddingHorizontal: 16,
            paddingVertical: 8,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
            borderWidth: 1,
            borderColor: pending ? Colors.neutral[300] : Colors.success.DEFAULT,
        }}>
            <Text style={{ fontSize: 18 }}>{pending ? '⏳' : '💰'}</Text>
            <Text style={{
                fontSize: 16,
                fontWeight: '700',
                color: pending ? Colors.neutral[600] : Colors.success.dark,
            }}>
                {formatINR(amount)}
            </Text>
            {pending && (
                <Text style={{ fontSize: 11, color: Colors.neutral[500] }}>Pending</Text>
            )}
        </Animated.View>
    );
}
