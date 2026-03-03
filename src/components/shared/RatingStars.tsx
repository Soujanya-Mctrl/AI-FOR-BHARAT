import { Colors } from '@/constants/colors';
import React from 'react';
import { Pressable, Text, View } from 'react-native';

interface RatingStarsProps {
    value: number;
    onChange?: (rating: number) => void;
    readonly?: boolean;
    size?: number;
}

export function RatingStars({ value, onChange, readonly = false, size = 24 }: RatingStarsProps) {
    const stars = [1, 2, 3, 4, 5];

    return (
        <View style={{ flexDirection: 'row', gap: 4 }}>
            {stars.map((star) => (
                <Pressable
                    key={star}
                    onPress={() => !readonly && onChange?.(star)}
                    disabled={readonly}
                    hitSlop={8}
                >
                    <Text style={{ fontSize: size, color: star <= value ? Colors.warning.DEFAULT : Colors.neutral[300] }}>
                        {star <= value ? '★' : '☆'}
                    </Text>
                </Pressable>
            ))}
        </View>
    );
}
