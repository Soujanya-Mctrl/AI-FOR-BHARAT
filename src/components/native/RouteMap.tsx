import { Colors } from '@/constants/colors';
import React from 'react';
import { Text, View } from 'react-native';

interface RouteMapProps {
    stops: Array<{ lat: number; lng: number; address?: string; status: string }>;
}

export function RouteMap({ stops }: RouteMapProps) {
    return (
        <View style={{ height: 250, backgroundColor: Colors.neutral[100], borderRadius: 12, justifyContent: 'center', alignItems: 'center', padding: 16 }}>
            <Text style={{ color: Colors.textSecondary, fontSize: 14 }}>🗺️ Route Map</Text>
            <Text style={{ color: Colors.textSecondary, fontSize: 12, marginTop: 4 }}>
                {stops.length} stops on today's route
            </Text>
            {stops.map((stop, i) => (
                <Text key={i} style={{ fontSize: 11, color: Colors.textSecondary, marginTop: 2 }}>
                    {i + 1}. {stop.address || `${stop.lat.toFixed(3)}, ${stop.lng.toFixed(3)}`} — {stop.status}
                </Text>
            ))}
        </View>
    );
}
