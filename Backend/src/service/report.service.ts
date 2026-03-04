import { IWasteReportDocument, WasteReportModel } from '../models/WasteReport.model';
import { ApiError } from '../utils/ApiError';

export class ReportService {
    static async createReport(reporterId: string, data: Record<string, any>): Promise<IWasteReportDocument> {
        if (!data.imageUrl || !data.location) {
            throw new ApiError(400, 'Image and location are required to create a waste report.');
        }

        const report = await WasteReportModel.create({
            reporterId,
            ...data
        });

        return report;
    }

    static async getReportsByArea(query: Record<string, any>): Promise<IWasteReportDocument[]> {
        // Complex geospatial queries would go here depending on the requirements.
        // Or simple exact match queries.
        const reports = await WasteReportModel.find(query).sort({ createdAt: -1 });
        return reports;
    }

    static async getMyReports(reporterId: string): Promise<IWasteReportDocument[]> {
        return WasteReportModel.find({ reporterId }).sort({ createdAt: -1 });
    }

    static async updateReportStatus(reportId: string, status: string): Promise<IWasteReportDocument> {
        const report = await WasteReportModel.findByIdAndUpdate(reportId, { status }, { new: true });
        if (!report) {
            throw new ApiError(404, 'Report not found.');
        }
        return report;
    }
}
