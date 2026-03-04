import { Request, Response } from 'express';
import { KabadiwallaService } from '../service/kabadiwalla.service';
import { ApiResponse } from '../utils/ApiResponse';
import { asyncHandler } from '../utils/asyncHandler';

export const getEarnings = asyncHandler(async (req: Request, res: Response) => {
    const earnings = await KabadiwallaService.getEarnings(req.user!._id);
    res.status(200).json(new ApiResponse(earnings));
});

export const getServiceAreas = asyncHandler(async (req: Request, res: Response) => {
    const areas = await KabadiwallaService.getServiceAreas(req.user!._id);
    res.status(200).json(new ApiResponse(areas));
});

export const verifyDocuments = asyncHandler(async (req: Request, res: Response) => {
    const result = await KabadiwallaService.verifyDocuments(req.user!._id, req.body.aadhaar, req.body.upiId);
    res.status(200).json(new ApiResponse({ verified: result }));
});
