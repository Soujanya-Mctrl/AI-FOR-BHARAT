import { Request, Response, NextFunction } from 'express';
import WasteReport from '../models/WasteReport';
import catchAsync from '../utils/catchAsync';
import { AppError } from '../utils/AppError';
import { classifyWasteImage } from '../services/gemini.service';

// POST /api/v1/reports
export const createReport = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    if (!req.file) {
        return next(new AppError('Please upload an image of the waste', 400));
    }

    const { lat, lng, address, pincode } = req.body;

    if (!lat || !lng) {
        return next(new AppError('Coordinates are required', 400));
    }

    // Cast `req.file` because CloudinaryStorage adds `path` property to it representing the URL
    const fileInfo = req.file as any;
    const imageUrl = fileInfo.path;

    // Real AI integration using Google Gen AI service
    const aiClassification = await classifyWasteImage(imageUrl);
    const resolvedWasteType = aiClassification.toLowerCase() !== 'unclassified' ? aiClassification : 'unclassified';

    const report = await WasteReport.create({
        citizenId: req.user.id,
        imageUrl,
        wasteType: resolvedWasteType,
        location: { lat, lng, address, pincode },
        aiClassification,
        verificationStatus: 'pending'
    });

    res.status(201).json({
        success: true,
        report
    });
});

// GET /api/v1/reports/history
export const getMyReports = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
    const skip = (page - 1) * limit;

    const query: any = { citizenId: req.user.id };
    if (req.query.status) query.verificationStatus = req.query.status;
    if (req.query.type) query.wasteType = req.query.type;

    if (req.query.startDate || req.query.endDate) {
        query.createdAt = {};
        if (req.query.startDate) query.createdAt.$gte = new Date(req.query.startDate as string);
        if (req.query.endDate) query.createdAt.$lte = new Date(req.query.endDate as string);
    }

    const reports = await WasteReport.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    const total = await WasteReport.countDocuments(query);

    res.status(200).json({
        success: true,
        reports,
        pagination: {
            page,
            limit,
            total,
            hasNext: skip + limit < total
        }
    });
});

// GET /api/v1/reports/:id
export const getReport = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const report = await WasteReport.findById(req.params.id)
        .populate('validationVotes.validatorId', 'name role')
        .populate('anomalyFlags');

    if (!report) {
        return next(new AppError('Report not found', 404));
    }

    // Only allow creator or admins/validators to see it
    if (
        report.citizenId.toString() !== req.user.id &&
        !['admin', 'green_champion', 'municipality'].includes(req.user.role)
    ) {
        return next(new AppError('Not authorized to access this report', 403));
    }

    res.status(200).json({
        success: true,
        report
    });
});

// GET /api/v1/reports/:id/verification
export const getReportVerification = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const report = await WasteReport.findById(req.params.id);

    if (!report) {
        return next(new AppError('Report not found', 404));
    }

    res.status(200).json({
        success: true,
        verification: {
            status: report.verificationStatus,
            aiClassification: report.aiClassification,
            kabadiwalaConfirmed: report.verificationStatus === 'kabadiwalla_confirmed' || report.verificationStatus === 'verified',
            validationVotes: report.validationVotes?.length || 0,
            votesRequired: 3,
            anomalyDetected: report.anomalyFlags && report.anomalyFlags.length > 0,
            lastUpdated: report.updatedAt
        }
    });
});

// GET /api/v1/reports/area/:pincode
export const getReportsByArea = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    if (!['admin', 'municipality'].includes(req.user.role)) {
        return next(new AppError('Not authorized to access reports in this area', 403));
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
    const skip = (page - 1) * limit;

    const query: any = { 'location.pincode': req.params.pincode };

    if (req.query.wasteType) query.wasteType = req.query.wasteType;
    if (req.query.startDate || req.query.endDate) {
        query.createdAt = {};
        if (req.query.startDate) query.createdAt.$gte = new Date(req.query.startDate as string);
        if (req.query.endDate) query.createdAt.$lte = new Date(req.query.endDate as string);
    }

    const reports = await WasteReport.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    const total = await WasteReport.countDocuments(query);

    res.status(200).json({
        success: true,
        reports,
        pagination: {
            page,
            limit,
            total,
            hasNext: skip + limit < total
        }
    });
});

// GET /api/v1/reports/filter/status
export const getReportsByStatus = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    if (!['admin', 'municipality', 'green_champion'].includes(req.user.role)) {
        return next(new AppError('Not authorized to access filtered reports', 403));
    }

    const { status } = req.query;
    if (!status || !['pending', 'kabadiwalla_confirmed', 'verified', 'suspicious', 'rejected'].includes(status as string)) {
        return next(new AppError('Valid verification status required', 400));
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
    const skip = (page - 1) * limit;

    const query: any = { verificationStatus: status };
    if (req.query.pincode) {
        query['location.pincode'] = req.query.pincode;
    }

    const reports = await WasteReport.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    const total = await WasteReport.countDocuments(query);

    res.status(200).json({
        success: true,
        reports,
        pagination: {
            page,
            limit,
            total,
            hasNext: skip + limit < total
        }
    });
});
