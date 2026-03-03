import { ConfirmPickupPayload, PickupRequest, PopulatedPickup, RequestPickupPayload } from '@/types/pickup.types';
import { NearbyKabadiwalla } from '@/types/user.types';
import api from './api';

export const pickupService = {
    /**
     * Request a pickup from a kabadiwalla
     */
    async requestPickup(payload: RequestPickupPayload): Promise<PickupRequest> {
        const { data } = await api.post('/api/pickups/request', payload);
        return data.data || data;
    },

    /**
     * Accept a pickup request (kabadiwalla)
     */
    async acceptPickup(id: string): Promise<PickupRequest> {
        const { data } = await api.patch(`/api/pickups/accept/${id}`);
        return data.data || data;
    },

    /**
     * Confirm a pickup with GPS and quality rating (kabadiwalla)
     */
    async confirmPickup(id: string, payload: ConfirmPickupPayload): Promise<PickupRequest> {
        const { data } = await api.post(`/api/pickups/confirm/${id}`, payload);
        return data.data || data;
    },

    /**
     * Rate a pickup (citizen)
     */
    async ratePickup(id: string, rating: number): Promise<PickupRequest> {
        const { data } = await api.post(`/api/pickups/rate/${id}`, { rating });
        return data.data || data;
    },

    /**
     * Get pickup by ID
     */
    async getPickupById(id: string): Promise<PopulatedPickup> {
        const { data } = await api.get(`/api/pickups/${id}`);
        return data.data || data;
    },

    /**
     * Get nearby kabadiwallas for pickup request map
     */
    async getNearbyKabadiwallas(lat: number, lng: number): Promise<NearbyKabadiwalla[]> {
        const { data } = await api.get('/api/kabadiwallas/nearby', {
            params: { lat, lng },
        });
        return data.data || data;
    },

    /**
     * Get today's route (kabadiwalla)
     */
    async getTodayRoute(): Promise<PickupRequest[]> {
        const { data } = await api.get('/api/pickups/route/today');
        return data.data || data;
    },

    /**
     * Get nearby pending pickup requests (kabadiwalla)
     */
    async getNearbyRequests(lat: number, lng: number): Promise<PickupRequest[]> {
        const { data } = await api.get('/api/pickups/nearby', {
            params: { lat, lng },
        });
        return data.data || data;
    },

    /**
     * Get pickup history (paginated)
     */
    async getPickupHistory(page: number = 1, limit: number = 20): Promise<{
        pickups: PickupRequest[];
        total: number;
        page: number;
        totalPages: number;
    }> {
        const { data } = await api.get('/api/pickups/history', {
            params: { page, limit },
        });
        return data;
    },
};
