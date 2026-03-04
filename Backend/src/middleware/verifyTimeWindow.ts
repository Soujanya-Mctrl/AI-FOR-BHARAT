import { NextFunction, Request, Response } from 'express';
import { ApiError } from '../utils/ApiError';

export const verifyTimeWindow = (req: Request, res: Response, next: NextFunction): void => {
    // Current server time, or requested scheduled time
    const targetTime = req.body.scheduledTime ? new Date(req.body.scheduledTime) : new Date();

    const hours = targetTime.getHours();

    // Example time window enforcement: 8 AM to 8 PM (20:00)
    if (hours < 8 || hours >= 20) {
        return next(new ApiError(400, 'Operation not allowed outside of operating hours (8 AM - 8 PM).'));
    }

    next();
};
