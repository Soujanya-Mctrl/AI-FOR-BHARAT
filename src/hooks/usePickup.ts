import { pickupService } from '@/services/pickup.service';
import { usePickupStore } from '@/stores/pickupStore';
import { useUIStore } from '@/stores/uiStore';
import { ConfirmPickupPayload, RequestPickupPayload } from '@/types/pickup.types';
import { useCallback, useState } from 'react';

export function usePickup() {
    const store = usePickupStore();
    const showToast = useUIStore((s) => s.showToast);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const requestPickup = useCallback(async (payload: RequestPickupPayload) => {
        setIsLoading(true);
        setError(null);
        try {
            const pickup = await pickupService.requestPickup(payload);
            store.setActivePickup(pickup);
            showToast('Pickup requested! Waiting for kabadiwalla to accept.', 'success');
            return pickup;
        } catch (err: any) {
            const msg = err.response?.data?.message || 'Failed to request pickup';
            setError(msg);
            showToast(msg, 'error');
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, [store, showToast]);

    const acceptPickup = useCallback(async (id: string) => {
        setIsLoading(true);
        try {
            const pickup = await pickupService.acceptPickup(id);
            store.updatePickupStatus(id, 'accepted');
            showToast('Pickup accepted!', 'success');
            return pickup;
        } catch (err: any) {
            showToast(err.response?.data?.message || 'Failed to accept pickup', 'error');
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, [store, showToast]);

    const confirmPickup = useCallback(async (id: string, payload: ConfirmPickupPayload) => {
        setIsLoading(true);
        try {
            const pickup = await pickupService.confirmPickup(id, payload);
            store.updatePickupStatus(id, 'confirmed');
            showToast('Pickup confirmed! Cross-reference check in progress.', 'success');
            return pickup;
        } catch (err: any) {
            showToast(err.response?.data?.message || 'Failed to confirm pickup', 'error');
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, [store, showToast]);

    const ratePickup = useCallback(async (id: string, rating: number) => {
        setIsLoading(true);
        try {
            const pickup = await pickupService.ratePickup(id, rating);
            store.updatePickupStatus(id, 'completed');
            showToast('Thank you for rating!', 'success');
            return pickup;
        } catch (err: any) {
            showToast(err.response?.data?.message || 'Failed to submit rating', 'error');
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, [store, showToast]);

    return {
        activePickup: store.activePickup,
        myPickups: store.myPickups,
        nearbyKabadiwallas: store.nearbyKabadiwallas,
        pendingRequests: store.pendingRequests,
        todayRoute: store.todayRoute,
        isLoading,
        error,
        requestPickup,
        acceptPickup,
        confirmPickup,
        ratePickup,
    };
}
