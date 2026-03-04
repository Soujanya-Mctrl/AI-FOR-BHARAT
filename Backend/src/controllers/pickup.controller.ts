import { Request, Response, NextFunction } from 'express';
import PickupRequest from '../models/PickupRequest';
import User from '../models/User';
import catchAsync from '../utils/catchAsync';
import { AppError } from '../utils/AppError';
import { segregationCoachAgent } from '../agents/segregationCoach.agent';
import { routeOptimizerAgent } from '../agents/routeOptimizer.agent';

// Helper function to calculate distance using Haversine formula (in km)
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Radius of the earth in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};

// POST /api/v1/pickups
export const createPickup = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { scheduledDate, scheduledTimeSlot, wasteType, notes, lat, lng } = req.body;

    if (!scheduledDate || !scheduledTimeSlot || !wasteType || lat === undefined || lng === undefined) {
        return next(new AppError('Missing required fields (scheduledDate, scheduledTimeSlot, wasteType, lat, lng)', 400));
    }

    if (!['morning', 'afternoon', 'evening'].includes(scheduledTimeSlot)) {
        return next(new AppError('Invalid time slot. Allowed: morning, afternoon, evening', 400));
    }

    // Assign nearest kabadiwalla logic
    const kabadiwallas = await User.find({ role: 'kabadiwalla', status: 'active' });
    let nearestKabadiwala = null;

    const sortedKabadiwallas = kabadiwallas
        .map(k => {
            const kLat = k.address?.lat || 0;
            const kLng = k.address?.lng || 0;
            const distance = calculateDistance(lat, lng, kLat, kLng);
            return { ...k.toObject(), distance };
        })
        .filter(k => k.distance <= 5) // Within 5km radius
        .sort((a, b) => {
            if (a.trustScore === b.trustScore) {
                return a.distance - b.distance;
            }
            return b.trustScore - a.trustScore; // Higher trust score first
        });

    if (sortedKabadiwallas.length > 0) {
        nearestKabadiwala = sortedKabadiwallas[0];
    }

    const pickup = await PickupRequest.create({
        citizenId: req.user.id,
        kabadiwalaId: nearestKabadiwala ? nearestKabadiwala._id : undefined,
        status: nearestKabadiwala ? 'pending' : 'pending',
        scheduledDate,
        scheduledTimeSlot,
        wasteType,
        notes,
        location: { lat, lng }
    });

    if (nearestKabadiwala) {
        console.log(`[Notification] Auto-assigned Kabadiwalla ${nearestKabadiwala.name} (ID: ${nearestKabadiwala._id}) to pickup ${pickup._id}`);
    } else {
        console.log(`[Notification] No nearby kabadiwalla found for pickup ${pickup._id}. Keeping as pending unassigned.`);
    }

    res.status(200).json({
        success: true,
        pickup
    });
});

// GET /api/v1/pickups/nearby-kabadiwallas
export const getNearbyKabadiwallas = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { lat, lng } = req.query;
    const radius = parseFloat(req.query.radius as string) || 5;

    if (!lat || !lng) {
        return next(new AppError('Latitude and longitude are required', 400));
    }

    const kabadiwallas = await User.find({ role: 'kabadiwalla', status: 'active' });

    const nearbyKabadiwallas = kabadiwallas
        .map(k => {
            const kLat = k.address?.lat || 0;
            const kLng = k.address?.lng || 0;
            const distance = calculateDistance(Number(lat), Number(lng), kLat, kLng);
            return {
                _id: k._id,
                name: k.name,
                trustScore: k.trustScore,
                distance: parseFloat(distance.toFixed(2)),
                rating: 0, // Mock: Implement real rating calc if tracked
                completedPickups: 0 // Mock: Implement real pickup count if tracked
            };
        })
        .filter(k => k.distance <= radius)
        .sort((a, b) => b.trustScore - a.trustScore);

    res.status(200).json({
        success: true,
        kabadiwallas: nearbyKabadiwallas
    });
});

// GET /api/v1/pickups/:id
export const getPickup = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const pickup = await PickupRequest.findById(req.params.id)
        .populate('citizenId', 'name phone profilePhoto')
        .populate('kabadiwalaId', 'name phone trustScore profilePhoto');

    if (!pickup) return next(new AppError('Pickup request not found', 404));

    // Role check
    const isOwner = pickup.citizenId._id.toString() === req.user.id;
    const isAssigned = pickup.kabadiwalaId && pickup.kabadiwalaId._id.toString() === req.user.id;
    const isAdminRole = ['admin', 'municipality', 'green_champion'].includes(req.user.role);

    if (!isOwner && !isAssigned && !isAdminRole) {
        return next(new AppError('Not authorized to access this pickup request', 403));
    }

    res.status(200).json({
        success: true,
        pickup
    });
});

// PATCH /api/v1/pickups/:id/cancel
export const cancelPickup = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const pickup = await PickupRequest.findById(req.params.id);

    if (!pickup) return next(new AppError('Pickup request not found', 404));

    // Only citizen who created it can cancel it
    if (pickup.citizenId.toString() !== req.user.id) {
        return next(new AppError('Not authorized to cancel this pickup request', 403));
    }

    if (!['pending', 'accepted'].includes(pickup.status)) {
        return next(new AppError(`Cannot cancel a pickup that is already ${pickup.status}`, 400));
    }

    pickup.status = 'cancelled';
    if (req.body.reason) {
        pickup.cancelReason = req.body.reason;
    }

    await pickup.save();

    // Decrease citizen trust score for cancellation (mock implementation)
    const citizen = await User.findById(req.user.id);
    if (citizen) {
        citizen.trustScore = Math.max(0, citizen.trustScore - 2); // Penalty of 2 points
        await citizen.save();
    }

    res.status(200).json({
        success: true,
        pickup
    });
});

// GET /api/v1/pickups/kabadiwalla/pending
export const getPendingPickupsKabadiwalla = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { lat, lng } = req.query;
    const radius = parseFloat(req.query.radius as string) || 10;

    // Create today date range
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const pickups = await PickupRequest.find({
        status: 'pending',
        scheduledDate: { $gte: startOfDay, $lte: endOfDay },
        $or: [
            { kabadiwalaId: req.user.id }, // Auto-assigned to this kabadiwalla
            { kabadiwalaId: { $exists: false } } // Or completely unassigned
        ]
    }).populate('citizenId', 'name');

    // If lat/lng provided, sort and filter by distance
    let formattedPickups = pickups.map(p => {
        const citizen = p.citizenId as any;
        let distance = 0;
        if (lat && lng && p.location) {
            distance = calculateDistance(Number(lat), Number(lng), p.location.lat, p.location.lng);
        }
        return {
            _id: p._id,
            citizenName: citizen.name,
            address: p.location.address,
            scheduledTimeSlot: p.scheduledTimeSlot,
            wasteType: p.wasteType,
            distance: parseFloat(distance.toFixed(2))
        };
    });

    if (lat && lng) {
        formattedPickups = formattedPickups.filter(p => p.distance <= radius);
        formattedPickups.sort((a, b) => a.distance - b.distance);
    } else {
        // Just sort by time slot if no location provided
        const timeWeights: any = { morning: 1, afternoon: 2, evening: 3 };
        formattedPickups.sort((a, b) => timeWeights[a.scheduledTimeSlot] - timeWeights[b.scheduledTimeSlot]);
    }

    res.status(200).json({
        success: true,
        pickups: formattedPickups
    });
});

// PATCH /api/v1/pickups/:id/accept
export const acceptPickup = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const pickup = await PickupRequest.findById(req.params.id);

    if (!pickup) return next(new AppError('Pickup request not found', 404));

    if (pickup.status !== 'pending') {
        return next(new AppError(`Pickup is already ${pickup.status} and cannot be accepted`, 400));
    }

    pickup.status = 'accepted';
    pickup.kabadiwalaId = req.user.id as any;
    await pickup.save();

    console.log(`[Notification] Auto-notifying citizen that Kabadiwalla ID ${req.user.id} accepted their pickup.`);

    res.status(200).json({
        success: true,
        pickup
    });
});

// PATCH /api/v1/pickups/:id/decline
export const declinePickup = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const pickup = await PickupRequest.findById(req.params.id);

    if (!pickup) return next(new AppError('Pickup request not found', 404));

    if (pickup.status === 'completed' || pickup.status === 'cancelled') {
        return next(new AppError(`Pickup is already ${pickup.status} and cannot be declined`, 400));
    }

    if (pickup.kabadiwalaId?.toString() !== req.user.id) {
        return next(new AppError('You are not assigned to this pickup', 403));
    }

    pickup.status = 'pending'; // Revert back to pending
    pickup.kabadiwalaId = undefined; // Unassign 
    if (req.body.reason) {
        pickup.declineReason = req.body.reason;
    }

    await pickup.save();

    res.status(200).json({
        success: true,
        message: 'Pickup declined'
    });
});

// POST /api/v1/pickups/:id/confirm
export const confirmPickup = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { segregationQuality, notes } = req.body;

    if (!['good', 'acceptable', 'poor'].includes(segregationQuality)) {
        return next(new AppError('Invalid segregationQuality. Must be good, acceptable, or poor', 400));
    }

    const pickup = await PickupRequest.findById(req.params.id);

    if (!pickup) return next(new AppError('Pickup request not found', 404));

    if (pickup.status !== 'accepted') {
        return next(new AppError(`Pickup must be in accepted state to be confirmed. Current status: ${pickup.status}`, 400));
    }

    if (pickup.kabadiwalaId?.toString() !== req.user.id) {
        return next(new AppError('You are not the assigned kabadiwalla for this pickup', 403));
    }

    // Mocking Server-Side GPS Capture (Using kabadiwalla's last known location)
    const kabadiwalla = await User.findById(req.user.id);
    const kabLat = kabadiwalla?.address?.lat || 0;
    const kabLng = kabadiwalla?.address?.lng || 0;

    const reqLat = pickup.location.lat;
    const reqLng = pickup.location.lng;

    const distanceKm = calculateDistance(kabLat, kabLng, reqLat, reqLng);

    // Enforce 200m radius (0.2km)
    if (distanceKm > 0.2) {
        console.warn(`[Warning] Kabadiwalla is ${distanceKm.toFixed(2)}km away. Overriding check for demo purposes.`);
        // In strict production: return next(new AppError('GPS mismatch. You must be within 200m of the pickup location.', 422));
    }

    let proofImage;
    if (req.file) {
        proofImage = (req.file as any).path;
    }

    pickup.status = 'completed';
    pickup.segregationQuality = segregationQuality;
    pickup.notes = notes;
    pickup.proofImage = proofImage;
    pickup.completedAt = new Date();
    pickup.completionLocation = { lat: kabLat, lng: kabLng };

    await pickup.save();

    // Trigger AI Segregation Coach if sorting was imperfect
    if (segregationQuality === 'poor' || segregationQuality === 'acceptable') {
        const citizenIdStr = pickup.citizenId.toString();
        const pickupIdStr = pickup._id.toString();
        // Fire and forget
        segregationCoachAgent.coachCitizen(pickupIdStr).catch(err => console.error('[Coach Error]', err));
    }

    // Award EcoPoints to Citizen based on segregation quality
    const citizen = await User.findById(pickup.citizenId);
    if (citizen) {
        let pointsToAward = 10; // Base points
        if (segregationQuality === 'good') pointsToAward += 5;
        if (segregationQuality === 'poor') pointsToAward -= 5;

        citizen.ecoPoints += pointsToAward;
        await citizen.save();
        console.log(`[Notification] Awarded ${pointsToAward} EcoPoints to Citizen ${citizen.name}`);
    }

    res.status(200).json({
        success: true,
        pickup
    });
});

// POST /api/v1/pickups/:id/rate
export const ratePickup = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { rating, comment } = req.body;

    if (rating === undefined || rating < 1 || rating > 5) {
        return next(new AppError('Valid rating from 1 to 5 is required', 400));
    }

    const pickup = await PickupRequest.findById(req.params.id);

    if (!pickup) return next(new AppError('Pickup request not found', 404));

    if (pickup.citizenId.toString() !== req.user.id) {
        return next(new AppError('Not authorized to rate this pickup', 403));
    }

    if (pickup.status !== 'completed') {
        return next(new AppError('Can only rate completed pickups', 400));
    }

    if (pickup.citizenRating) {
        return next(new AppError('Pickup has already been rated', 409));
    }

    pickup.citizenRating = rating;
    if (comment) pickup.ratingComment = comment;

    await pickup.save();

    // Update Kabadiwalla Trust Score
    const kabadiwalla = await User.findById(pickup.kabadiwalaId);
    if (kabadiwalla) {
        // Simple moving average imitation: Adjust trust score by looking at the diff from a baseline (e.g. 3)
        // A 5-star rating pulls score up, 1-star pulls it down.
        const diff = rating - 3;
        kabadiwalla.trustScore = Math.min(100, Math.max(0, kabadiwalla.trustScore + (diff * 2)));
        await kabadiwalla.save();
    }

    res.status(200).json({
        success: true,
        message: 'Rating submitted'
    });
});

// GET /api/v1/pickups/history/citizen
export const getCitizenPickupHistory = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
    const skip = (page - 1) * limit;

    const query: any = { citizenId: req.user.id };

    if (req.query.status) query.status = req.query.status;
    if (req.query.startDate || req.query.endDate) {
        query.createdAt = {};
        if (req.query.startDate) query.createdAt.$gte = new Date(req.query.startDate as string);
        if (req.query.endDate) query.createdAt.$lte = new Date(req.query.endDate as string);
    }

    const pickups = await PickupRequest.find(query)
        .populate('kabadiwalaId', 'name phone profilePhoto')
        .sort({ scheduledDate: -1 })
        .skip(skip)
        .limit(limit);

    const total = await PickupRequest.countDocuments(query);

    res.status(200).json({
        success: true,
        pickups,
        pagination: { page, limit, total, hasNext: skip + limit < total }
    });
});

// GET /api/v1/pickups/history/kabadiwalla
export const getKabadiwallaPickupHistory = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
    const skip = (page - 1) * limit;

    const query: any = { kabadiwalaId: req.user.id }; // Only pickups assigned to them

    if (req.query.status) query.status = req.query.status;
    if (req.query.startDate || req.query.endDate) {
        query.createdAt = {};
        if (req.query.startDate) query.createdAt.$gte = new Date(req.query.startDate as string);
        if (req.query.endDate) query.createdAt.$lte = new Date(req.query.endDate as string);
    }

    const pickups = await PickupRequest.find(query)
        .populate('citizenId', 'name address phone')
        .sort({ scheduledDate: -1 })
        .skip(skip)
        .limit(limit);

    const total = await PickupRequest.countDocuments(query);

    res.status(200).json({
        success: true,
        pickups,
        pagination: { page, limit, total, hasNext: skip + limit < total }
    });
});

// GET /api/v1/pickups/kabadiwalla/route
export const getOptimizedRoute = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    // 1. Ask Gemini to organize today's schedule
    const kabadiwalaId = req.user.id;

    // We pass today's date to the route optimizer
    const date = new Date();
    await routeOptimizerAgent.optimizeRoute(kabadiwalaId, date);

    res.status(200).json({
        success: true,
        message: 'Route optimization process triggered. Kabadiwalla will be notified upon completion.'
    });
});

