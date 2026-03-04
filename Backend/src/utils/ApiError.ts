export interface ValidationDetail {
    field?: string;
    message: string;
}

export class ApiError extends Error {
    public statusCode: number;
    public details?: ValidationDetail[];
    public isOperational: boolean;

    constructor(statusCode: number, message: string, details?: ValidationDetail[], isOperational = true) {
        super(message);
        this.statusCode = statusCode;
        this.details = details;
        this.isOperational = isOperational;

        Error.captureStackTrace(this, this.constructor);
    }
}
