import dotenv from 'dotenv';
import path from 'path';
import { z } from 'zod';

// Load initial basic env for resolution (we usually don't dictate the exact file here since node handles .env root by default,
// but assuming .env root loading based on process.cwd)
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const envSchema = z.object({
    PORT: z.string().default('5000'),
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

    CLOUDINARY_CLOUD_NAME: z.string(),
    CLOUDINARY_API_KEY: z.string(),
    CLOUDINARY_API_SECRET: z.string(),
    CLOUDINARY_FOLDER: z.string().default('ecowaste'),

    MONGO_URI: z.string().url(),
    BETTER_AUTH_SECRET: z.string(),
    BETTER_AUTH_URL: z.string().url(),
    GOOGLE_CLIENT_ID: z.string(),
    GOOGLE_CLIENT_SECRET: z.string(),

    JWT_SECRET: z.string(),
    JWT_EXPIRES_IN: z.string().default('7d'),

    MAIL_HOST: z.string(),
    MAIL_PORT: z.string(),
    MAIL_USER: z.string(),
    MAIL_PASS: z.string(),

    FRONTEND_URL: z.string().url(),
    CORS_ORIGIN: z.string().url(),

    GEMINI_API_KEY: z.string(),

    EXPOTOKEN: z.string().optional(),

    ADMIN_EMAIL: z.string().email(),
    ADMIN_PASSWORD: z.string(),

    RAZORPAY_KEY_ID: z.string(),
    RAZORPAY_KEY_SECRET: z.string(),
    RAZORPAY_WEBHOOK_SECRET: z.string().optional()
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
    console.error('❌ Invalid environment variables:', _env.error.format());
    throw new Error('Invalid environment variables');
}

export const env = _env.data;
