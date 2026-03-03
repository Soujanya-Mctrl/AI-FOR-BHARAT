import { EarningsSummary } from '@/types/api.types';
import { User } from '@/types/user.types';
import api from './api';

export const userService = {
    /**
     * Get current user profile
     */
    async getProfile(): Promise<User> {
        const { data } = await api.get('/verify');
        return data.user;
    },

    /**
     * Get user quality score details
     */
    async getQualityScore(): Promise<{
        score: number;
        breakdown: Record<string, number>;
        history: Array<{ date: string; score: number }>;
    }> {
        const { data } = await api.get('/api/users/quality-score');
        return data.data || data;
    },

    /**
     * Get earnings summary for a period
     */
    async getEarnings(period: 'today' | 'week' | 'month' = 'week'): Promise<EarningsSummary> {
        const { data } = await api.get('/api/users/earnings', {
            params: { period },
        });
        return data.data || data;
    },

    /**
     * Update kabadiwalla profile (onboarding)
     */
    async updateKabadiwalaProfile(profileData: {
        serviceAreaPincodes?: string[];
        upiId?: string;
    }): Promise<User> {
        const { data } = await api.put('/api/users/kabadiwalla-profile', profileData);
        return data.data || data;
    },

    /**
     * Register push notification token
     */
    async registerPushToken(token: string): Promise<void> {
        await api.post('/api/users/push-token', { token });
    },

    /**
     * Mark training as complete
     */
    async completeTraining(): Promise<void> {
        await api.post('/api/users/training-complete');
    },

    /**
     * Get leaderboard
     */
    async getLeaderboard(): Promise<{
        topUsers: any[];
        currentUser: any;
    }> {
        const { data } = await api.get('/api/leaderboard');
        return data;
    },

    /**
     * Get user dashboard
     */
    async getDashboard(): Promise<any> {
        const { data } = await api.get('/api/user');
        return data;
    },
};
