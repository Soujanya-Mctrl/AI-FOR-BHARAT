import { Colors } from '@/constants/colors';
import React from 'react';
import { Platform, Text, View } from 'react-native';

// Placeholder component — MapView requires native setup
// Will use react-native-maps on native and a placeholder on web

interface MapPickupViewProps {
    kabadiwallas: Array<{ lat: number; lng: number; username: string; reliabilityScore: number }>;
    citizenLocation?: { lat: number; lng: number };
    onSelectKabadiwalla?: (index: number) => void;
}

export function MapPickupView({ kabadiwallas, citizenLocation, onSelectKabadiwalla }: MapPickupViewProps) {
    if (Platform.OS === 'web') {
        return (
            <View style={{ height: 250, backgroundColor: Colors.neutral[100], borderRadius: 12, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ color: Colors.textSecondary }}>Map — {kabadiwallas.length} kabadiwallas nearby</Text>
            </View>
        );
    }

    // On native, render react-native-maps
    // Note: requires Google Maps API key configured in app.json
    return (
        <View style={{ height: 250, backgroundColor: Colors.neutral[100], borderRadius: 12, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: Colors.textSecondary, fontSize: 14 }}>🗺️ Map View</Text>
            <Text style={{ color: Colors.textSecondary, fontSize: 12, marginTop: 4 }}>
                {kabadiwallas.length} kabadiwallas nearby
            </Text>
            {citizenLocation && (
                <Text style={{ color: Colors.primary[600], fontSize: 11, marginTop: 4 }}>
                    📍 Your location: {citizenLocation.lat.toFixed(4)}, {citizenLocation.lng.toFixed(4)}
                </Text>
            )}
        </View>
    );
}
