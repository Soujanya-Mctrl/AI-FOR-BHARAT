import { Request, Response } from 'express';
import { TrustService } from '../service/trust.service';
import { ApiResponse } from '../utils/ApiResponse';
import { asyncHandler } from '../utils/asyncHandler';

export const getTrustScore = asyncHandler(async (req: Request, res: Response) => {
    const score = await TrustService.getTrustScore(String(req.params.id || req.user!._id));
    res.status(200).json(new ApiResponse(score));
});

export const adjustTrustScore = asyncHandler(async (req: Request, res: Response) => {
    const newScore = await TrustService.adjustScore(String(req.params.id), req.body.amount, req.body.reason);
    res.status(200).json(new ApiResponse({ newScore }, 'Trust score adjusted'));
});
