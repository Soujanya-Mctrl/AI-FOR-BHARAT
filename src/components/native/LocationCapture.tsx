import * as Location from 'expo-location';
import { useEffect } from 'react';

interface LocationCaptureProps {
    onLocation: (data: { lat: number; lng: number; accuracy: number | null }) => void;
    onError?: (error: string) => void;
}

export function LocationCapture({ onLocation, onError }: LocationCaptureProps) {
    useEffect(() => {
        (async () => {
            try {
                const { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== 'granted') {
                    onError?.('Location permission denied');
                    return;
                }
                const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
                onLocation({
                    lat: loc.coords.latitude,
                    lng: loc.coords.longitude,
                    accuracy: loc.coords.accuracy,
                });
            } catch (err: any) {
                onError?.(err.message || 'Failed to get location');
            }
        })();
    }, []);

    return null; // Invisible component
}
