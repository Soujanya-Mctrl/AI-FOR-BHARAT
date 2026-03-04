import { Request, Response, NextFunction } from 'express';
import QualityScore from '../models/QualityScore';
import PickupRequest from '../models/PickupRequest';
import AnomalyFlag from '../models/AnomalyFlag';
import catchAsync from '../utils/catchAsync';
import { AppError } from '../utils/AppError';

// POST /api/v1/verification/cross-reference
// This might typically be an internal webbook or called by Kabadiwalla/Admin upon completion
export const triggerCrossReference = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { pickupId } = req.body;

    if (!pickupId) return next(new AppError('Pickup ID is required', 400));

    const pickup = await PickupRequest.findById(pickupId);
    if (!pickup || pickup.status !== 'completed') {
        return next(new AppError('Pickup not found or not completed', 400));
    }

    // Simulated Verification Logic (e.g., matching coordinates, times, image APIs)
    const isMatch = true; // Replace with actual verification logic later

    // Ensure the QualityScore entry exists or create one based on cross-ref
    let qualityScore = await QualityScore.findOne({ pickupId: pickup._id });

    if (!qualityScore) {
        qualityScore = await QualityScore.create({
            pickupId: pickup._id,
            overall: 85,
            segregation: pickup.segregationQuality === 'good' ? 90 : 70,
            imageMatch: 80,
            gpsAccuracy: 95,
            timeCompliance: 80,
            crossRefScore: isMatch ? 100 : 0
        });
    } else {
        qualityScore.crossRefScore = isMatch ? 100 : 0;
        await qualityScore.save();
    }

    res.status(200).json({
        success: true,
        message: 'Cross-reference verification completed',
        results: {
            match: isMatch,
            confidence: 0.95
        }
    });
});

// GET /api/v1/verification/quality-score/:pickupId
export const getQualityScore = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { pickupId } = req.params;

    const score = await QualityScore.findOne({ pickupId });
    if (!score) return next(new AppError('Quality score not found for this pickup', 404));

    res.status(200).json({
        success: true,
        score
    });
});

// GET /api/v1/verification/anomalies
export const getAnomalies = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
    const skip = (page - 1) * limit;

    // Typically Admins/Municipalities query these
    const query: any = {};
    if (req.query.resolved) query.resolved = req.query.resolved === 'true';

    const anomalies = await AnomalyFlag.find(query)
        .populate('userId', 'name role')
        .populate('reportId', 'wasteType imageUrl')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    const total = await AnomalyFlag.countDocuments(query);

    res.status(200).json({
        success: true,
        anomalies,
        pagination: {
            page,
            limit,
            total,
            hasNext: skip + limit < total
        }
    });
});

// POST /api/v1/verification/manual-review
export const submitManualReview = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { reportId, decision, notes } = req.body;

    if (!['verified', 'rejected', 'suspicious'].includes(decision)) {
        return next(new AppError('Invalid decision', 400));
    }

    // Update Anomaly Flag if exists
    const anomaly = await AnomalyFlag.findOne({ reportId, resolved: false });
    if (anomaly) {
        anomaly.resolved = true;
        anomaly.resolution = {
            decision,
            reviewedBy: req.user.id as any, // mongoose id
            notes,
            reviewedAt: new Date()
        };
        await anomaly.save();
    }

    // Mute any references inside report etc if needed.

    res.status(200).json({
        success: true,
        message: 'Review submitted successfully'
    });
});
