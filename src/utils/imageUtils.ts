import * as FileSystem from 'expo-file-system';
import * as ImageManipulator from 'expo-image-manipulator';
import { Platform } from 'react-native';

/**
 * Compress an image to a target maximum size in KB
 * Indian phones produce 4-8MB photos — this ensures upload stays under 800KB
 */
export async function compressImage(
    uri: string,
    maxKB: number = 800
): Promise<string> {
    const maxBytes = maxKB * 1024;

    // Start with moderate compression
    let quality = 0.7;
    let width = 1200;

    let result = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { width } }],
        { compress: quality, format: ImageManipulator.SaveFormat.JPEG }
    );

    // If still too large, reduce further
    if (Platform.OS !== 'web') {
        const info = await FileSystem.getInfoAsync(result.uri);
        if (info.exists && 'size' in info && info.size && info.size > maxBytes) {
            quality = 0.5;
            width = 800;
            result = await ImageManipulator.manipulateAsync(
                uri,
                [{ resize: { width } }],
                { compress: quality, format: ImageManipulator.SaveFormat.JPEG }
            );
        }
    }

    return result.uri;
}

/**
 * Convert an image URI to base64 string for AI API calls
 */
export async function toBase64(uri: string): Promise<string> {
    if (Platform.OS === 'web') {
        // On web, fetch and convert
        const response = await fetch(uri);
        const blob = await response.blob();
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result as string;
                // Remove data URL prefix
                const base64 = result.split(',')[1] || result;
                resolve(base64);
            };
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    }

    const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: 'base64' as any,
    });
    return base64;
}
