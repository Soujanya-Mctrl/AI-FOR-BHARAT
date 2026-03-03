import api from './api';

export const facilityService = {
    /**
     * Get facilities with optional filtering
     */
    async getFacilities(params?: { state?: string; minRating?: number }): Promise<{
        facilities: any[];
        total: number;
    }> {
        const { data } = await api.get('/facilities', { params });
        return data;
    },

    /**
     * Search facilities by query
     */
    async searchFacilities(query: string): Promise<{
        state: string;
        total: number;
        recyclers: any[];
    }> {
        const { data } = await api.get('/facilities/search', {
            params: { query },
        });
        return data;
    },
};
