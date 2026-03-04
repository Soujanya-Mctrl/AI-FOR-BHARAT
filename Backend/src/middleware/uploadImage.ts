import { NextFunction, Request, Response } from 'express';
import multer from 'multer';
import cloudinary from '../config/cloudinary';
import { ApiError } from '../utils/ApiError';

const storage = multer.memoryStorage();

const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only JPEG and PNG are allowed.'));
    }
};

const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
    fileFilter,
});

export const uploadImageMiddleware = upload.single('image');

export const processImageUpload = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        if (!req.file) {
            // For updates, the image might be optional. 
            // If it's strictly required, the controller should validate it, 
            // or we add a parameter to the middleware to enforce it.
            return next();
        }

        // Upload to Cloudinary using a stream
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: process.env.CLOUDINARY_FOLDER || 'ecowaste',
            },
            (error, result) => {
                if (error) {
                    return next(new ApiError(500, 'Image upload failed', [{ message: error.message }]));
                }
                if (result) {
                    // Attach the URL to the body so downstream controllers can use it
                    req.body.imageUrl = result.secure_url;
                }
                next();
            }
        );

        // End the stream with the buffer
        uploadStream.end(req.file.buffer);

    } catch (error) {
        next(new ApiError(500, 'Server error during image processing.'));
    }
};
