import { Request, Response } from 'express';
import PickupModel from '../models/Pickup.model.js';

export const requestPickup = async (req: Request, res: Response) => {
    try {
        const { kabadiwalaId, scheduledWindow, citizenLocation, reportId } = req.body;
        const citizenId = req.user._id;

        const pickup = await PickupModel.create({
            citizenId,
            kabadiwalaId,
            scheduledWindow,
            citizenLocation,
            reportId,
            status: 'requested',
            paymentStatus: 'pending'
        });

        res.status(201).json({ success: true, data: pickup });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const acceptPickup = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const kabadiwalaId = req.user._id;

        const pickup = await PickupModel.findByIdAndUpdate(
            id,
            { kabadiwalaId, status: 'accepted' },
            { new: true }
        );

        if (!pickup) {
            return res.status(404).json({ success: false, message: 'Pickup not found' });
        }

        res.status(200).json({ success: true, data: pickup });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const confirmPickup = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { qualityRating, arrivalLat, arrivalLng, dwellTimeMinutes } = req.body;

        const pickup = await PickupModel.findById(id);
        if (!pickup) {
            return res.status(404).json({ success: false, message: 'Pickup not found' });
        }

        pickup.status = 'confirmed';
        pickup.kabadiwalaQualityRating = qualityRating;
        pickup.kabadiwalaArrival = {
            lat: arrivalLat,
            lng: arrivalLng,
            arrivedAt: new Date(),
            dwellTimeMinutes
        };

        // Basic Trust Score Calculation (Placeholder for more complex logic)
        // In a real scenario, we'd compare citizenLocation with kabadiwalaArrival
        const distance = 0; // Ideally calculated using haversine
        const compositeScore = qualityRating === 'good' ? 90 : qualityRating === 'acceptable' ? 70 : 40;

        pickup.crossReferenceResult = {
            compositeScore,
            anomalyFlags: [],
            processedAt: new Date()
        };

        await pickup.save();

        res.status(200).json({ success: true, data: pickup });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getPickupById = async (req: Request, res: Response) => {
    try {
        const pickup = await PickupModel.findById(req.params.id)
            .populate('citizenId', 'username email citizenProfile')
            .populate('kabadiwalaId', 'username email kabadiwalaProfile');

        if (!pickup) {
            return res.status(404).json({ success: false, message: 'Pickup not found' });
        }

        res.status(200).json({ success: true, data: pickup });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getNearbyRequests = async (req: Request, res: Response) => {
    try {
        // For now, returning all requested pickups. 
        // In production, we'd use $near for GeoJSON or simple lat/lng bounds.
        const pickups = await PickupModel.find({ status: 'requested' })
            .populate('citizenId', 'username email citizenProfile');

        res.status(200).json({ success: true, data: pickups });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getTodayRoute = async (req: Request, res: Response) => {
    try {
        const kabadiwalaId = req.user._id;
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        const pickups = await PickupModel.find({
            kabadiwalaId,
            status: { $in: ['accepted', 'arriving'] },
            'scheduledWindow.start': { $gte: startOfDay, $lte: endOfDay }
        }).populate('citizenId', 'username email citizenProfile');

        res.status(200).json({ success: true, data: pickups });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getPickupHistory = async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (page - 1) * limit;

        const query = req.user.role === 'admin'
            ? {}
            : { $or: [{ citizenId: req.user._id }, { kabadiwalaId: req.user._id }] };

        const pickups = await PickupModel.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate('citizenId', 'username email')
            .populate('kabadiwalaId', 'username email');

        const total = await PickupModel.countDocuments(query);

        res.status(200).json({
            success: true,
            pickups,
            total,
            page,
            totalPages: Math.ceil(total / limit)
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};
