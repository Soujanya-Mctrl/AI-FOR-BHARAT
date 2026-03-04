import { NextFunction, Request, Response } from 'express';
import { auth } from '../lib/auth';
import { ApiError } from '../utils/ApiError';

export const authenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const session = await auth.api.getSession({
            headers: req.headers
        });

        if (!session) {
            return next(new ApiError(401, 'Authentication required. Please log in.'));
        }

        // Attach user and session to request
        // Mapping Better Auth user to existing req.user structure
        req.user = {
            ...session.user,
            _id: session.user.id,
            role: (session.user as any).role || 'citizen'
        } as any;
        (req as any).session = session;

        next();
    } catch (error) {
        next(error);
    }
};
