import { ClassificationResult, WasteReport } from '@/types/report.types';
import api from './api';

export const reportService = {
    /**
     * Submit a waste report with image (multipart form)
     */
    async createReport(formData: FormData): Promise<{ report: WasteReport; classification: ClassificationResult }> {
        const { data } = await api.post('/report/image', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return data;
    },

    /**
     * Classify waste from an image via AI
     */
    async classifyWaste(imageUri: string): Promise<ClassificationResult> {
        const formData = new FormData();
        formData.append('image', {
            uri: imageUri,
            type: 'image/jpeg',
            name: 'waste.jpg',
        } as any);

        const { data } = await api.post('/report/image', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return data.classification;
    },

    /**
     * Get user's reports with pagination
     */
    async getMyReports(page: number = 1, limit: number = 20): Promise<{
        reports: WasteReport[];
        total: number;
    }> {
        const offset = (page - 1) * limit;
        const { data } = await api.get('/report/list', {
            params: { offset, limit },
        });
        return data;
    },
};
