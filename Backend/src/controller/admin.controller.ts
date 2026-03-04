import { Request, Response } from 'express';
import { AdminService } from '../service/admin.service';
import { ApiResponse } from '../utils/ApiResponse';
import { asyncHandler } from '../utils/asyncHandler';

export const getSystemStats = asyncHandler(async (req: Request, res: Response) => {
    const stats = await AdminService.getSystemStats();
    res.status(200).json(new ApiResponse(stats));
});

export const suspendUser = asyncHandler(async (req: Request, res: Response) => {
    await AdminService.suspendUser(String(req.params.userId));
    res.status(200).json(new ApiResponse(null, 'User suspended'));
});

export const exportCSV = asyncHandler(async (req: Request, res: Response) => {
    const csv = await AdminService.exportUserDataAsCSV();
    res.set({ 'Content-Type': 'text/csv', 'Content-Disposition': 'attachment; filename=users.csv' });
    res.send(csv);
});
