import { Request, Response } from 'express';
import { PickupService } from '../service/pickup.service';
import { ApiResponse } from '../utils/ApiResponse';
import { asyncHandler } from '../utils/asyncHandler';

export const createPickup = asyncHandler(async (req: Request, res: Response) => {
    const pickup = await PickupService.createPickup(req.user!._id, req.body);
    res.status(201).json(new ApiResponse(pickup, 'Pickup request created'));
});

export const acceptPickup = asyncHandler(async (req: Request, res: Response) => {
    const pickup = await PickupService.acceptPickup(String(req.params.id), req.user!._id);
    res.status(200).json(new ApiResponse(pickup, 'Pickup accepted'));
});

export const declinePickup = asyncHandler(async (req: Request, res: Response) => {
    const pickup = await PickupService.declinePickup(String(req.params.id), req.user!._id);
    res.status(200).json(new ApiResponse(pickup, 'Pickup declined'));
});

export const confirmPickup = asyncHandler(async (req: Request, res: Response) => {
    const pickup = await PickupService.confirmPickup(String(req.params.id), req.user!._id);
    res.status(200).json(new ApiResponse(pickup, 'Pickup confirmed'));
});

export const cancelPickup = asyncHandler(async (req: Request, res: Response) => {
    const pickup = await PickupService.declinePickup(String(req.params.id), req.user!._id);
    res.status(200).json(new ApiResponse(pickup, 'Pickup cancelled'));
});

export const getPickup = asyncHandler(async (req: Request, res: Response) => {
    const pickups = await PickupService.getPendingPickupsNearby({});
    const found = pickups.find(p => p._id.toString() === req.params.id);
    res.status(200).json(new ApiResponse(found));
});

export const getPendingPickups = asyncHandler(async (req: Request, res: Response) => {
    const pickups = await PickupService.getPendingPickupsNearby({});
    res.status(200).json(new ApiResponse(pickups));
});

export const getNearbyKabadiwallas = asyncHandler(async (req: Request, res: Response) => {
    res.status(200).json(new ApiResponse([], 'Nearby kabadiwallas'));
});

export const ratePickup = asyncHandler(async (req: Request, res: Response) => {
    res.status(200).json(new ApiResponse(null, 'Rating submitted'));
});

export const getCitizenPickupHistory = asyncHandler(async (req: Request, res: Response) => {
    const history = await PickupService.getPendingPickupsNearby({});
    res.status(200).json(new ApiResponse(history));
});

export const getKabadiwallaPickupHistory = asyncHandler(async (req: Request, res: Response) => {
    const history = await PickupService.getPendingPickupsNearby({});
    res.status(200).json(new ApiResponse(history));
});

export const getOptimizedRoute = asyncHandler(async (req: Request, res: Response) => {
    res.status(200).json(new ApiResponse([], 'Route optimization pending'));
});
