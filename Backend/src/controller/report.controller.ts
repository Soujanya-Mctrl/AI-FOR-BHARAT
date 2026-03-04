import { Request, Response } from 'express';
import { ReportService } from '../service/report.service';
import { ApiResponse } from '../utils/ApiResponse';
import { asyncHandler } from '../utils/asyncHandler';

export const createReport = asyncHandler(async (req: Request, res: Response) => {
    const report = await ReportService.createReport(req.user!._id, req.body);
    res.status(201).json(new ApiResponse(report, 'Report created'));
});

export const getMyReports = asyncHandler(async (req: Request, res: Response) => {
    const reports = await ReportService.getMyReports(req.user!._id);
    res.status(200).json(new ApiResponse(reports));
});

export const getReport = asyncHandler(async (req: Request, res: Response) => {
    const reports = await ReportService.getReportsByArea({ _id: String(req.params.id) });
    res.status(200).json(new ApiResponse(reports[0]));
});

export const getReportsByStatus = asyncHandler(async (req: Request, res: Response) => {
    const reports = await ReportService.getReportsByArea({ status: String(req.query.status) });
    res.status(200).json(new ApiResponse(reports));
});

export const getReportsByArea = asyncHandler(async (req: Request, res: Response) => {
    const reports = await ReportService.getReportsByArea({ 'location.address': { $regex: String(req.params.pincode) } });
    res.status(200).json(new ApiResponse(reports));
});

export const updateReportStatus = asyncHandler(async (req: Request, res: Response) => {
    const report = await ReportService.updateReportStatus(String(req.params.id), req.body.status);
    res.status(200).json(new ApiResponse(report, 'Status updated'));
});
