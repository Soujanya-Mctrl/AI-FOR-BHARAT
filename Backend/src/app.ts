// Express app setup: middleware chain, route mounting, error handler
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import { generalLimiter } from './middleware/rateLimiter';
import { sanitizeMongoDB, sanitizeXSS } from './middleware/sanitize';
import routes from './routes';
import { ApiError } from './utils/ApiError';

import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";

const app = express();

// Better Auth Handler
app.all("/api/v1/auth/*path", toNodeHandler(auth));

// Body parser
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Cookie parser
app.use(cookieParser());

// CORS
app.use(cors({
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true
}));

// Data sanitization
app.use(sanitizeMongoDB);
app.use(sanitizeXSS);

// Rate limiting
app.use('/api', generalLimiter);

// Default route
app.get('/', (req: Request, res: Response) => {
    res.status(200).json({
        success: true,
        message: 'Welcome to EcoWaste Management System API'
    });
});

// API Routes
app.use('/api/v1', routes);

// Handle undefined routes
app.all('*path', (req: Request, res: Response, next: NextFunction) => {
    next(new ApiError(404, `Can't find ${req.originalUrl} on this server!`));
});

// Global error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    res.status(statusCode).json({
        success: false,
        error: {
            code: statusCode,
            message,
            details: err.details || undefined
        },
        requestId: require('crypto').randomUUID(),
        timestamp: new Date().toISOString()
    });
});

export default app;
