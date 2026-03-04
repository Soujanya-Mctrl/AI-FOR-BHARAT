import { Request, Response } from 'express';
import { MunicipalityService } from '../service/municipality.service';
import { ApiResponse } from '../utils/ApiResponse';
import { asyncHandler } from '../utils/asyncHandler';

export const getDashboard = asyncHandler(async (req: Request, res: Response) => {
    const data = await MunicipalityService.getDashboardData(req.query.ward as string);
    res.status(200).json(new ApiResponse(data));
});

export const exportCompliancePDF = asyncHandler(async (req: Request, res: Response) => {
    const pdf = await MunicipalityService.generateComplianceReportPDF(req.query.ward as string);
    res.set({ 'Content-Type': 'application/pdf', 'Content-Disposition': 'attachment; filename=compliance.pdf' });
    res.send(pdf);
});
