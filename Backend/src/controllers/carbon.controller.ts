import { Request, Response, NextFunction } from 'express';
import CarbonCreditReport from '../models/CarbonCreditReport';
import catchAsync from '../utils/catchAsync';

// POST /api/v1/carbon/generate
export const generateReport = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { startDate, endDate, wardIds } = req.body;

    // Mock calculation logic for carbon credits
    const totalDiversion = 1500; // tons
    const co2Credits = totalDiversion * 0.8; // mock conversion rate

    const report = await CarbonCreditReport.create({
        period: {
            start: new Date(startDate),
            end: new Date(endDate) // or Date.now()
        },
        wardIds,
        totalDiversion,
        co2Credits,
        format: 'json',
        generatedBy: req.user.id,
        generatedAt: new Date(),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days validity
    });

    res.status(201).json({
        success: true,
        report,
        message: 'Carbon credit report generated successfully',
    });
});

// GET /api/v1/carbon/reports
export const getReports = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const reports = await CarbonCreditReport.find()
        .sort({ createdAt: -1 })
        .limit(10);

    res.status(200).json({
        success: true,
        reports
    });
});
