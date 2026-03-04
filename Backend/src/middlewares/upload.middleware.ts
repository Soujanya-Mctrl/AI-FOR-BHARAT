import multer from 'multer';
import { Request } from 'express';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { AppError } from '../utils/AppError';
import { config } from '../config/env';

// Configure Cloudinary
cloudinary.config({
    cloud_name: config.cloudinary.cloudName,
    api_key: config.cloudinary.apiKey,
    api_secret: config.cloudinary.apiSecret,
});

// Using local memory storage before pushing manually if we wanted, 
// OR direct cloudinary storage (shown below)
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req: Request, file: Express.Multer.File) => {
        return {
            folder: 'ecowaste',
            format: 'jpeg', // Or function to detect
            allowed_formats: ['jpg', 'jpeg', 'png'],
        };
    },
});

const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new AppError('Not an image! Please upload only images.', 400) as any);
    }
};

export const uploadImage = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
});

// Helper if we want to extract Cloudinary URL in controller
// It's mostly auto-handled and populated on `req.file.path` by CloudinaryStorage
