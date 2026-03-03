import { Camera } from 'expo-camera';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import { Alert, Platform } from 'react-native';

type PermissionResult = 'granted' | 'denied' | 'undetermined';

/**
 * Request camera permission with rationale
 */
export async function requestCamera(): Promise<PermissionResult> {
    const permission = await Camera.getCameraPermissionsAsync();
    if (permission.status === 'granted') return 'granted';

    if (Platform.OS !== 'web') {
        Alert.alert(
            'Camera Access Needed',
            'EcoWaste needs camera access to photograph your waste for AI classification. This helps identify waste types automatically.',
            [{ text: 'OK' }]
        );
    }

    const result = await Camera.requestCameraPermissionsAsync();
    return result.status === 'granted' ? 'granted' : 'denied';
}

/**
 * Request foreground location permission with rationale
 */
export async function requestLocation(): Promise<PermissionResult> {
    const { status: existingStatus } = await Location.getForegroundPermissionsAsync();
    if (existingStatus === 'granted') return 'granted';

    if (Platform.OS !== 'web') {
        Alert.alert(
            'Location Access Needed',
            'EcoWaste needs your location to verify pickups and connect you with nearby kabadiwallas.',
            [{ text: 'OK' }]
        );
    }

    const { status } = await Location.requestForegroundPermissionsAsync();
    return status === 'granted' ? 'granted' : 'denied';
}

/**
 * Request background location permission (for kabadiwalla route tracking)
 */
export async function requestBackgroundLocation(): Promise<PermissionResult> {
    // Must have foreground permission first
    const fgResult = await requestLocation();
    if (fgResult !== 'granted') return fgResult;

    if (Platform.OS === 'web') return 'denied';

    const { status: existingStatus } = await Location.getBackgroundPermissionsAsync();
    if (existingStatus === 'granted') return 'granted';

    Alert.alert(
        'Background Location Needed',
        'For route tracking, EcoWaste needs background location access. This helps optimize your pickup route.',
        [{ text: 'OK' }]
    );

    const { status } = await Location.requestBackgroundPermissionsAsync();
    return status === 'granted' ? 'granted' : 'denied';
}

/**
 * Request notification permission with rationale
 */
export async function requestNotifications(): Promise<PermissionResult> {
    if (Platform.OS === 'web') return 'denied';

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    if (existingStatus === 'granted') return 'granted';

    Alert.alert(
        'Notifications',
        'EcoWaste sends notifications for pickup updates, payment confirmations, and streak milestones.',
        [{ text: 'OK' }]
    );

    const { status } = await Notifications.requestPermissionsAsync();
    return status === 'granted' ? 'granted' : 'denied';
}
