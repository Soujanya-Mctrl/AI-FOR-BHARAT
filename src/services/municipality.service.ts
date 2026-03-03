import { AnalyticsDataPoint, DashboardMetrics, StreetCompliance } from '@/types/api.types';
import api from './api';

export const municipalityService = {
    /**
     * Get ward compliance dashboard data
     */
    async getDashboard(): Promise<{
        metrics: DashboardMetrics;
        streets: StreetCompliance[];
        alerts: Array<{ message: string; severity: string; pickupId?: string }>;
    }> {
        const { data } = await api.get('/api/municipality/dashboard');
        return data.data || data;
    },

    /**
     * Get detailed verified pickup reports with filters
     */
    async getReports(filters?: {
        page?: number;
        limit?: number;
        dateFrom?: string;
        dateTo?: string;
        minScore?: number;
        area?: string;
    }): Promise<{
        reports: any[];
        total: number;
        page: number;
        totalPages: number;
    }> {
        const { data } = await api.get('/api/municipality/reports', {
            params: filters,
        });
        return data.data || data;
    },

    /**
     * Get analytics trends
     */
    async getAnalytics(): Promise<{
        complianceTrend: AnalyticsDataPoint[];
        qualityDistribution: Array<{ label: string; count: number }>;
        weeklyPickups: AnalyticsDataPoint[];
        topStreets: StreetCompliance[];
        bottomStreets: StreetCompliance[];
    }> {
        const { data } = await api.get('/api/municipality/analytics');
        return data.data || data;
    },
};
