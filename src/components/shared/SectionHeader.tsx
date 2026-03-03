import { Colors } from '@/constants/colors';
import React from 'react';
import { Pressable, Text, View } from 'react-native';

interface SectionHeaderProps { title: string; actionLabel?: string; onAction?: () => void; }

export function SectionHeader({ title, actionLabel, onAction }: SectionHeaderProps) {
    return (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12 }}>
            <Text style={{ fontSize: 16, fontWeight: '700', color: Colors.text }}>{title}</Text>
            {actionLabel && onAction && (
                <Pressable onPress={onAction}>
                    <Text style={{ fontSize: 14, color: Colors.primary[600], fontWeight: '600' }}>{actionLabel}</Text>
                </Pressable>
            )}
        </View>
    );
}
