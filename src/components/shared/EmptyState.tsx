import { Colors } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, Text, View } from 'react-native';

interface EmptyStateProps { icon?: string; title: string; subtitle?: string; ctaLabel?: string; onCta?: () => void; }

export function EmptyState({ icon = 'leaf-outline', title, subtitle, ctaLabel, onCta }: EmptyStateProps) {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 }}>
            <Ionicons name={icon as any} size={64} color={Colors.neutral[300]} />
            <Text style={{ marginTop: 16, fontSize: 18, fontWeight: '600', color: Colors.text, textAlign: 'center' }}>{title}</Text>
            {subtitle && <Text style={{ marginTop: 8, fontSize: 14, color: Colors.textSecondary, textAlign: 'center' }}>{subtitle}</Text>}
            {ctaLabel && onCta && (
                <Pressable onPress={onCta} style={{ marginTop: 20, backgroundColor: Colors.primary[600], paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8 }}>
                    <Text style={{ color: Colors.white, fontWeight: '600' }}>{ctaLabel}</Text>
                </Pressable>
            )}
        </View>
    );
}
