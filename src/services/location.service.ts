import * as Location from 'expo-location';
import { Platform } from 'react-native';

export interface LocationResult {
    lat: number;
    lng: number;
    accuracy: number | null;
}

/**
 * Request foreground location permission
 */
export async function requestPermission(): Promise<'granted' | 'denied'> {
    const { status } = await Location.requestForegroundPermissionsAsync();
    return status === 'granted' ? 'granted' : 'denied';
}

/**
 * Get current GPS location with high accuracy
 */
export async function getCurrentLocation(): Promise<LocationResult> {
    const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
    });

    return {
        lat: location.coords.latitude,
        lng: location.coords.longitude,
        accuracy: location.coords.accuracy,
    };
}

/**
 * Reverse geocode GPS coordinates to human-readable address
 */
export async function reverseGeocode(lat: number, lng: number): Promise<string> {
    try {
        if (Platform.OS === 'web') {
            return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
        }

        const results = await Location.reverseGeocodeAsync({ latitude: lat, longitude: lng });
        if (results.length > 0) {
            const addr = results[0];
            const parts = [
                addr.street,
                addr.district,
                addr.city,
                addr.region,
                addr.postalCode,
            ].filter(Boolean);
            return parts.join(', ') || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
        }
        return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    } catch {
        return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    }
}
