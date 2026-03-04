import { NextFunction, Request, Response } from 'express';
import { UserRole } from '../types';
import { ApiError } from '../utils/ApiError';

export const authorize = (...roles: UserRole[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return next(new ApiError(403, 'Forbidden: You do not have permission to perform this action.'));
        }
        next();
    };
};
