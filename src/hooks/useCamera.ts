import { requestCamera } from '@/utils/permissions';
import { CameraView } from 'expo-camera';
import { useCallback, useRef, useState } from 'react';

export function useCamera() {
    const cameraRef = useRef<CameraView>(null);
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const [isReady, setIsReady] = useState(false);

    const requestPermission = useCallback(async () => {
        const result = await requestCamera();
        const granted = result === 'granted';
        setHasPermission(granted);
        return granted;
    }, []);

    const takePicture = useCallback(async (): Promise<string | null> => {
        if (!cameraRef.current || !isReady) return null;

        try {
            const photo = await cameraRef.current.takePictureAsync({
                quality: 0.7,
            });
            return photo?.uri || null;
        } catch {
            return null;
        }
    }, [isReady]);

    const onCameraReady = useCallback(() => {
        setIsReady(true);
    }, []);

    return {
        cameraRef,
        hasPermission,
        isReady,
        requestPermission,
        takePicture,
        onCameraReady,
    };
}
