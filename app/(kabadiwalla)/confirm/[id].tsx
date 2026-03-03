import { ConfirmPickupForm } from '@/components/forms/ConfirmPickupForm';
import { Colors } from '@/constants/colors';
import { useLocation } from '@/hooks/useLocation';
import { usePickup } from '@/hooks/usePickup';
import type { QualityRating } from '@/types/pickup.types';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, Text } from 'react-native';

export default function ConfirmPickupScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const { confirmPickup } = usePickup();
    const { currentLocation, accuracy } = useLocation();
    const [quality, setQuality] = useState<QualityRating | null>(null);
    const [notes, setNotes] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async () => {
        if (!quality || !id || !currentLocation) return;
        setIsLoading(true);
        try {
            await confirmPickup(id, {
                qualityRating: quality,
                notes,
                arrivalLat: currentLocation.lat,
                arrivalLng: currentLocation.lng,
                dwellTimeMinutes: 5, // Estimated — backend will validate
            });
            router.back();
        } catch { } finally {
            setIsLoading(false);
        }
    };

    return (
        <ScrollView style={{ flex: 1, backgroundColor: Colors.background }} contentContainerStyle={{ padding: 24, paddingTop: 60 }}>
            <Text style={{ fontSize: 22, fontWeight: '700', color: Colors.text, marginBottom: 4 }}>Confirm Pickup</Text>
            <Text style={{ fontSize: 13, color: Colors.textSecondary, marginBottom: 24 }}>
                Rate the citizen's waste segregation quality
            </Text>

            <ConfirmPickupForm
                quality={quality}
                onQualityChange={setQuality}
                notes={notes}
                onNotesChange={setNotes}
                gpsAccuracy={accuracy}
                onSubmit={handleSubmit}
                isLoading={isLoading}
            />
        </ScrollView>
    );
}
