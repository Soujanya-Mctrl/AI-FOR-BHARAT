import { Request, Response } from 'express';
import { VerificationService } from '../service/verification.service';
import { ApiResponse } from '../utils/ApiResponse';
import { asyncHandler } from '../utils/asyncHandler';

export const triggerVerification = asyncHandler(async (req: Request, res: Response) => {
    const result = await VerificationService.triggerCrossReference(String(req.params.reportId));
    res.status(200).json(new ApiResponse(result, 'Verification triggered'));
});
