import { Request, Response, NextFunction } from 'express';
import User from '../models/User';
import PickupRequest from '../models/PickupRequest';
import catchAsync from '../utils/catchAsync';
import { AppError } from '../utils/AppError';

// GET /api/v1/users/profile
export const getProfile = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findById(req.user.id);

    if (!user) return next(new AppError('User not found', 404));

    res.status(200).json({
        success: true,
        user
    });
});

// PUT /api/v1/users/profile
export const updateProfile = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { name, phone, address, upiId } = req.body;

    const user = await User.findByIdAndUpdate(
        req.user.id,
        { name, phone, address, upiId },
        { new: true, runValidators: true }
    );

    res.status(200).json({
        success: true,
        user
    });
});

// PATCH /api/v1/users/address
export const updateAddress = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    // Support both { street, city, ... } and { address: { street, city, ... } } body structures
    const data = req.body.address || req.body;
    const { street, city, pincode, lat, lng } = data;

    const userToUpdate = await User.findById(req.user.id);
    if (!userToUpdate) {
        return next(new AppError('User not found', 404));
    }

    const updatedAddress = {
        street: street ?? userToUpdate.address?.street,
        city: city ?? userToUpdate.address?.city,
        pincode: pincode ?? userToUpdate.address?.pincode,
        lat: lat ?? userToUpdate.address?.lat,
        lng: lng ?? userToUpdate.address?.lng,
    };

    // Basic coord validation
    if (updatedAddress.lat !== undefined && updatedAddress.lng !== undefined) {
        if (updatedAddress.lat < -90 || updatedAddress.lat > 90 || updatedAddress.lng < -180 || updatedAddress.lng > 180) {
            return next(new AppError('Invalid coordinates', 400));
        }
    }

    const user = await User.findByIdAndUpdate(
        req.user.id,
        { address: updatedAddress },
        { new: true, runValidators: true }
    );

    res.status(200).json({
        success: true,
        address: user?.address
    });
});

// GET /api/v1/users/trust-score
export const getTrustScore = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findById(req.user.id);

    if (!user) return next(new AppError('User not found', 404));

    // Note: Detailed breakdown logic might require querying TrustScore model based on role.
    // For simplicity returning basic structure based on User model info right now.
    res.status(200).json({
        success: true,
        trustScore: user.trustScore,
        breakdown: {
            reportConsistency: 0, // Placeholder
            segregationQuality: 0, // Placeholder
            frequency: 0, // Placeholder
            penalties: 0 // Placeholder
        }
    });
});

// GET /api/v1/users/points
export const getPoints = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findById(req.user.id);
    res.status(200).json({
        success: true,
        ecoPoints: user?.ecoPoints,
        greenPoints: user?.greenPoints
    });
});

// GET /api/v1/users/pickup-history
export const getPickupHistory = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
    const skip = (page - 1) * limit;

    const query: any = { citizenId: req.user.id };
    if (req.query.status) query.status = req.query.status;

    const pickups = await PickupRequest.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    const total = await PickupRequest.countDocuments(query);

    res.status(200).json({
        success: true,
        pickups,
        pagination: {
            page,
            limit,
            total,
            hasNext: skip + limit < total
        }
    });
});

// POST /api/v1/users/profile-photo
export const uploadProfilePhoto = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    if (!req.file) {
        return next(new AppError('Please upload an image', 400));
    }

    // Cast `req.file` because CloudinaryStorage adds `path` property to it representing the URL
    const fileInfo = req.file as any;
    const profilePhotoUrl = fileInfo.path;

    const user = await User.findByIdAndUpdate(
        req.user.id,
        { profilePhoto: profilePhotoUrl },
        { new: true }
    );

    res.status(200).json({
        success: true,
        profilePhoto: user?.profilePhoto
    });
});

// GET /api/v1/users/green-champion/eligibility
export const checkGCeligibility = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findById(req.user.id);

    if (!user) return next(new AppError('User not found', 404));

    const eligible = user.trustScore >= 80;

    res.status(200).json({
        success: true,
        eligible,
        criteria: {
            minTrustScore: true,
            minReports: true,
            minStreak: true
        },
        currentValues: {
            trustScore: user.trustScore,
            totalReports: 10, // mock
            currentStreak: 5 // mock
        }
    });
});

// POST /api/v1/users/green-champion/accept
export const acceptGCInvite = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { inviteToken } = req.body;
    if (!inviteToken) return next(new AppError('Invite token required', 400));

    // Verify invite token logic here... (Mock validation for now)

    const user = await User.findByIdAndUpdate(
        req.user.id,
        { role: 'green_champion', isGreenChampion: true },
        { new: true }
    );

    res.status(200).json({
        success: true,
        message: 'Green Champion role activated',
        user
    });
});
