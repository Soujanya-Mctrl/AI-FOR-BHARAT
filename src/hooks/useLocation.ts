import * as locationService from '@/services/location.service';
import { useLocationStore } from '@/stores/locationStore';
import { useEffect, useState } from 'react';

export function useLocation() {
    const { currentLocation, permissionStatus, accuracy } = useLocationStore();
    const setLocation = useLocationStore((s) => s.setLocation);
    const setPermissionStatus = useLocationStore((s) => s.setPermissionStatus);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (permissionStatus === 'undetermined') {
            (async () => {
                const status = await locationService.requestPermission();
                setPermissionStatus(status);
                if (status === 'granted') {
                    setIsLoading(true);
                    try {
                        const loc = await locationService.getCurrentLocation();
                        setLocation({ lat: loc.lat, lng: loc.lng }, loc.accuracy);
                    } catch {
                        // Location might not be available
                    } finally {
                        setIsLoading(false);
                    }
                }
            })();
        }
    }, [permissionStatus, setPermissionStatus, setLocation]);

    const refresh = async () => {
        setIsLoading(true);
        try {
            const loc = await locationService.getCurrentLocation();
            setLocation({ lat: loc.lat, lng: loc.lng }, loc.accuracy);
        } catch {
            // Silently fail
        } finally {
            setIsLoading(false);
        }
    };

    return {
        currentLocation,
        permissionStatus,
        accuracy,
        isLoading,
        refresh,
    };
}
