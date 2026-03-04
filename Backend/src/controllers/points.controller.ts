import { Request, Response, NextFunction } from 'express';
import PointsTransaction from '../models/PointsTransaction';
import User from '../models/User';
import catchAsync from '../utils/catchAsync';
import { AppError } from '../utils/AppError';

// GET /api/v1/points/balance
export const getBalance = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findById(req.user.id);
    if (!user) return next(new AppError('User not found', 404));

    res.status(200).json({
        success: true,
        ecoPoints: user.ecoPoints,
        greenPoints: user.greenPoints
    });
});

// GET /api/v1/points/history
export const getPointsHistory = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
    const skip = (page - 1) * limit;

    const type = req.query.type as string;
    const pointType = req.query.pointType as string;

    const query: any = { userId: req.user.id };
    if (type) query.type = type;
    if (pointType) query.pointType = pointType;

    const transactions = await PointsTransaction.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    const total = await PointsTransaction.countDocuments(query);

    res.status(200).json({
        success: true,
        transactions,
        pagination: {
            page,
            limit,
            total,
            hasNext: skip + limit < total
        }
    });
});

// POST /api/v1/points/redeem
export const redeemPoints = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { pointType, amount, method, upiId } = req.body;

    if (!pointType || !amount || !method) {
        return next(new AppError('Missing required fields', 400));
    }

    const user = await User.findById(req.user.id);
    if (!user) return next(new AppError('User not found', 404));

    if (pointType === 'eco' && user.ecoPoints < amount) {
        return next(new AppError('Insufficient EcoPoints balance', 400));
    } else if (pointType === 'green' && user.greenPoints < amount) {
        return next(new AppError('Insufficient GreenPoints balance', 400));
    }

    // Deduct points
    if (pointType === 'eco') {
        user.ecoPoints -= amount;
    } else {
        user.greenPoints -= amount;
    }
    await user.save();

    // Create transaction record
    const transaction = await PointsTransaction.create({
        userId: user._id,
        type: 'redeemed',
        pointType,
        amount,
        redemptionDetails: {
            method,
            upiId,
            status: 'processing'
        },
        description: `Redeemed ${amount} ${pointType} points via ${method}`
    });

    res.status(200).json({
        success: true,
        message: 'Redemption request submitted successfully',
        transactionId: transaction._id,
        newBalance: {
            ecoPoints: user.ecoPoints,
            greenPoints: user.greenPoints
        }
    });
});
