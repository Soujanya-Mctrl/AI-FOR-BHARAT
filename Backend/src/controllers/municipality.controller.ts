import { Request, Response, NextFunction } from 'express';
import MunicipalityDashboard from '../models/MunicipalityDashboard';
import catchAsync from '../utils/catchAsync';
import { AppError } from '../utils/AppError';

// GET /api/v1/municipality/dashboard/:wardId
export const getDashboardStats = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { wardId } = req.params;
    const dateStr = req.query.date as string;
    let queryDate = new Date(); // Default today

    if (dateStr) {
        queryDate = new Date(dateStr);
    }

    // To query a specific day, we find entries bounding that day
    const startOfDay = new Date(queryDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(queryDate.setHours(23, 59, 59, 999));

    let dashboard = await MunicipalityDashboard.findOne({
        wardId,
        date: { $gte: startOfDay, $lte: endOfDay }
    });

    if (!dashboard) {
        // Mock returning an empty structure if none exists for that day yet
        dashboard = {
            wardId,
            date: startOfDay,
            complianceRate: 0,
            totalPickups: 0,
            verifiedPickups: 0,
            segregationRate: 0,
            ecoScore: 0,
            unresolvedReports: 0,
            topColonies: [],
            worstAreas: []
        } as any;
    }

    res.status(200).json({
        success: true,
        data: dashboard
    });
});
