import { Colors } from '@/constants/colors';
import type { QualityRating } from '@/types/pickup.types';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ActivityIndicator, Pressable, Text, TextInput, View } from 'react-native';

interface ConfirmPickupFormProps {
    quality: QualityRating | null;
    onQualityChange: (q: QualityRating) => void;
    notes: string;
    onNotesChange: (n: string) => void;
    gpsAccuracy: number | null;
    onSubmit: () => void;
    isLoading?: boolean;
}

const qualityOptions: Array<{ value: QualityRating; label: string; desc: string; color: string; icon: string }> = [
    { value: 'good', label: 'Good', desc: 'Correctly segregated — wet and dry separated', color: Colors.success.DEFAULT, icon: 'thumbs-up' },
    { value: 'acceptable', label: 'Acceptable', desc: 'Mostly correct with minor issues', color: Colors.warning.DEFAULT, icon: 'hand-right' },
    { value: 'poor', label: 'Poor', desc: 'Mixed waste — not properly segregated', color: Colors.error.DEFAULT, icon: 'thumbs-down' },
];

export function ConfirmPickupForm({ quality, onQualityChange, notes, onNotesChange, gpsAccuracy, onSubmit, isLoading }: ConfirmPickupFormProps) {
    return (
        <View style={{ gap: 16 }}>
            <Text style={{ fontSize: 16, fontWeight: '700', color: Colors.text }}>Segregation Quality</Text>

            {qualityOptions.map((opt) => (
                <Pressable
                    key={opt.value}
                    onPress={() => onQualityChange(opt.value)}
                    style={{
                        borderWidth: 2,
                        borderColor: quality === opt.value ? opt.color : Colors.border,
                        backgroundColor: quality === opt.value ? opt.color + '15' : Colors.white,
                        borderRadius: 12,
                        padding: 16,
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 12,
                    }}
                >
                    <Ionicons name={opt.icon as any} size={24} color={quality === opt.value ? opt.color : Colors.neutral[400]} />
                    <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 15, fontWeight: '600', color: quality === opt.value ? opt.color : Colors.text }}>{opt.label}</Text>
                        <Text style={{ fontSize: 12, color: Colors.textSecondary, marginTop: 2 }}>{opt.desc}</Text>
                    </View>
                </Pressable>
            ))}

            <View>
                <Text style={{ fontSize: 14, fontWeight: '500', color: Colors.text, marginBottom: 6 }}>Notes (optional)</Text>
                <TextInput
                    style={{ borderWidth: 1, borderColor: Colors.border, borderRadius: 10, padding: 14, fontSize: 15, color: Colors.text, backgroundColor: Colors.white }}
                    placeholder="Any notes for this pickup?"
                    placeholderTextColor={Colors.neutral[400]}
                    maxLength={200}
                    value={notes}
                    onChangeText={onNotesChange}
                />
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 4 }}>
                <Ionicons name="location" size={16} color={Colors.success.DEFAULT} />
                <Text style={{ fontSize: 13, color: Colors.textSecondary }}>
                    Location captured ✓ {gpsAccuracy ? `(±${Math.round(gpsAccuracy)}m)` : ''}
                </Text>
            </View>

            <Pressable
                onPress={onSubmit}
                disabled={!quality || isLoading}
                style={{
                    backgroundColor: !quality || isLoading ? Colors.neutral[300] : Colors.primary[600],
                    paddingVertical: 16,
                    borderRadius: 12,
                    alignItems: 'center',
                    marginTop: 8,
                }}
            >
                {isLoading ? (
                    <ActivityIndicator color={Colors.white} />
                ) : (
                    <Text style={{ color: Colors.white, fontSize: 16, fontWeight: '700' }}>Confirm Pickup</Text>
                )}
            </Pressable>
        </View>
    );
}
