import { Request, Response } from 'express';
import { NotificationService } from '../service/notification.service';
import { ApiResponse } from '../utils/ApiResponse';
import { asyncHandler } from '../utils/asyncHandler';

export const sendNotification = asyncHandler(async (req: Request, res: Response) => {
    const { userId, title, body, data } = req.body;
    const result = await NotificationService.sendPush(userId, title, body, data);
    res.status(200).json(new ApiResponse({ sent: result }));
});
