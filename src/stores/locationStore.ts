import { create } from 'zustand';

interface LocationState {
    currentLocation: { lat: number; lng: number } | null;
    permissionStatus: 'granted' | 'denied' | 'undetermined';
    isWatching: boolean;
    accuracy: number | null;
}

interface LocationActions {
    setLocation: (location: { lat: number; lng: number }, accuracy?: number | null) => void;
    setPermissionStatus: (status: 'granted' | 'denied' | 'undetermined') => void;
    startWatching: () => void;
    stopWatching: () => void;
}

export const useLocationStore = create<LocationState & LocationActions>((set) => ({
    currentLocation: null,
    permissionStatus: 'undetermined',
    isWatching: false,
    accuracy: null,

    setLocation: (location, accuracy = null) =>
        set({ currentLocation: location, accuracy }),

    setPermissionStatus: (status) =>
        set({ permissionStatus: status }),

    startWatching: () => set({ isWatching: true }),
    stopWatching: () => set({ isWatching: false }),
}));
