import { Request, Response, NextFunction } from 'express';

export class AppError extends Error {
    public statusCode: number;
    public status: string;
    public isOperational: boolean;

    constructor(message: string, statusCode: number) {
        super(message);

        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    const response: any = {
        success: false,
        error: {
            code: err.statusCode,
            message: err.message,
        },
        requestId: req.headers['x-request-id'] || `req_${Date.now()}`,
        timestamp: new Date().toISOString()
    };

    if (err.name === 'ValidationError') {
        response.error.code = 422;
        response.error.message = 'Validation failed';
        response.error.details = Object.values(err.errors).map((val: any) => ({
            field: val.path,
            message: val.message,
            type: val.kind
        }));
    } else if (err.code === 11000) {
        response.error.code = 409;
        const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
        response.error.message = `Duplicate field value: ${value}. Please use another value!`;
    } else if (err.name === 'JsonWebTokenError') {
        response.error.code = 401;
        response.error.message = 'Invalid token. Please log in again!';
    } else if (err.name === 'TokenExpiredError') {
        response.error.code = 401;
        response.error.message = 'Your token has expired! Please log in again.';
    }

    // Include stack trace in development
    if (process.env.NODE_ENV === 'development') {
        response.error.stack = err.stack;
    }

    res.status(response.error.code).json(response);
};
