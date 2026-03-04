import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from './error.middleware'; // reusing from earlier setup
import { config } from '../config/env';

// Extend Express Request object to include user
declare global {
    namespace Express {
        interface Request {
            user?: any; // Replace any with IUser if user model is defined
        }
    }
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // 1) Getting token and check of it's there
        let token;

        // Check headers first (Bearer Token)
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }
        // Otherwise check cookies (HTTP-Only)
        else if (req.headers.cookie) {
            const cookies = req.headers.cookie.split(';');
            const jwtCookie = cookies.find(c => c.trim().startsWith('jwt='));
            if (jwtCookie) {
                token = jwtCookie.split('=')[1];
            }
        }

        if (!token) {
            return next(new AppError('You are not logged in! Please log in to get access.', 401));
        }

        // 2) Verification token
        const decoded = jwt.verify(token, config.jwtSecret);

        // 3) Check if user still exists (Optional, typically query DB to ensure user wasn't deleted/suspended)
        // const currentUser = await User.findById(decoded.id);
        // if (!currentUser) return next(new AppError('The user belonging to this token no longer exists.', 401));
        // if (currentUser.status === 'suspended') return next(new AppError('Account suspended', 403));

        // 4) Attach User to Request
        req.user = decoded; // Contains id, role, etc. from token generation
        next();
    } catch (err: any) {
        if (err.name === 'TokenExpiredError') {
            return next(new AppError('Your token has expired! Please log in again.', 401));
        }
        return next(new AppError('Invalid token. Please log in again!', 401));
    }
};

export const authorize = (...roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        // roles is an array ['admin', 'municipality'].
        if (!roles.includes(req.user.role)) {
            return next(new AppError('You do not have permission to perform this action', 403));
        }
        next();
    };
};
