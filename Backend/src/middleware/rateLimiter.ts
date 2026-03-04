import rateLimit from 'express-rate-limit';
import { ApiError } from '../utils/ApiError';

export const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    handler: (req, res, next) => next(new ApiError(429, 'Too many requests, please try again later.')),
    standardHeaders: true,
    legacyHeaders: false,
});

export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 requests per windowMs for auth routes
    handler: (req, res, next) => next(new ApiError(429, 'Too many authentication attempts, please try again later.')),
    standardHeaders: true,
    legacyHeaders: false,
});

export const exportLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10, // Limit each IP to 10 CSV/PDF exports per hour
    handler: (req, res, next) => next(new ApiError(429, 'Export quota exceeded, please try again later.')),
    standardHeaders: true,
    legacyHeaders: false,
});
