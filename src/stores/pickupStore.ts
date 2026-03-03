import { PickupRequest } from '@/types/pickup.types';
import { NearbyKabadiwalla } from '@/types/user.types';
import { create } from 'zustand';

interface PickupState {
    activePickup: PickupRequest | null;
    myPickups: PickupRequest[];
    nearbyKabadiwallas: NearbyKabadiwalla[];
    pendingRequests: PickupRequest[];
    todayRoute: PickupRequest[];
    isLoading: boolean;
}

interface PickupActions {
    setActivePickup: (pickup: PickupRequest | null) => void;
    setMyPickups: (pickups: PickupRequest[]) => void;
    updatePickupStatus: (id: string, status: PickupRequest['status']) => void;
    setNearbyKabadiwallas: (kabadiwallas: NearbyKabadiwalla[]) => void;
    setPendingRequests: (requests: PickupRequest[]) => void;
    setTodayRoute: (pickups: PickupRequest[]) => void;
    setLoading: (loading: boolean) => void;
    reset: () => void;
}

const initialState: PickupState = {
    activePickup: null,
    myPickups: [],
    nearbyKabadiwallas: [],
    pendingRequests: [],
    todayRoute: [],
    isLoading: false,
};

export const usePickupStore = create<PickupState & PickupActions>((set, get) => ({
    ...initialState,

    setActivePickup: (pickup) => set({ activePickup: pickup }),

    setMyPickups: (pickups) => set({ myPickups: pickups }),

    updatePickupStatus: (id, status) => {
        const { activePickup, myPickups, todayRoute, pendingRequests } = get();
        if (activePickup?._id === id) {
            set({ activePickup: { ...activePickup, status } });
        }
        set({
            myPickups: myPickups.map((p) =>
                p._id === id ? { ...p, status } : p
            ),
            todayRoute: todayRoute.map((p) =>
                p._id === id ? { ...p, status } : p
            ),
            pendingRequests: pendingRequests.filter((p) =>
                p._id !== id || status === 'requested'
            ),
        });
    },

    setNearbyKabadiwallas: (kabadiwallas) => set({ nearbyKabadiwallas: kabadiwallas }),
    setPendingRequests: (requests) => set({ pendingRequests: requests }),
    setTodayRoute: (pickups) => set({ todayRoute: pickups }),
    setLoading: (loading) => set({ isLoading: loading }),
    reset: () => set(initialState),
}));
