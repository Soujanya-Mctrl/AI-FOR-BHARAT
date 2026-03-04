import { Request, Response } from 'express';
import { UserService } from '../service/user.service';
import { ApiResponse } from '../utils/ApiResponse';
import { asyncHandler } from '../utils/asyncHandler';

export const getProfile = asyncHandler(async (req: Request, res: Response) => {
    const user = await UserService.getProfile(req.user!._id);
    res.status(200).json(new ApiResponse(user));
});

export const updateProfile = asyncHandler(async (req: Request, res: Response) => {
    const user = await UserService.updateProfile(req.user!._id, req.body);
    res.status(200).json(new ApiResponse(user, 'Profile updated'));
});

export const getPickupHistory = asyncHandler(async (req: Request, res: Response) => {
    const history = await UserService.getPickupHistory(req.user!._id);
    res.status(200).json(new ApiResponse(history));
});
