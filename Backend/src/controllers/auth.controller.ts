import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/User';
import catchAsync from '../utils/catchAsync';
import { AppError } from '../utils/AppError';
import { config } from '../config/env';
import { sendEmail, passwordResetEmailTemplate } from '../utils/email';

const signToken = (id: string, role: string) => {
    return jwt.sign({ id, role }, config.jwtSecret, {
        expiresIn: config.jwtExpiresIn,
    } as any);
};

const signRefreshToken = (id: string) => {
    return jwt.sign({ id }, config.jwtRefreshSecret, {
        expiresIn: config.jwtRefreshExpiresIn,
    } as any);
};

const sendTokenResponse = (user: any, statusCode: number, res: Response) => {
    const token = signToken(user._id, user.role);
    const refreshToken = signRefreshToken(user._id);

    user.refreshToken = refreshToken;
    user.save({ validateBeforeSave: false });

    const cookieOptions = {
        expires: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
    };

    const refreshCookieOptions = {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
    };

    res.cookie('jwt', token, cookieOptions);
    res.cookie('refreshToken', refreshToken, refreshCookieOptions);

    res.status(statusCode).json({
        success: true,
        token,
        user,
    });
};

export const register = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, password, phone, role, address } = req.body;

    if (!['citizen', 'kabadiwalla', 'municipality'].includes(role)) {
        return next(new AppError('Invalid role specified', 400));
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return next(new AppError('Email already exists', 409));
    }

    const newUser = await User.create({
        name,
        email,
        password,
        phone,
        role,
        address,
    });

    sendTokenResponse(newUser, 201, res);
});

export const login = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new AppError('Please provide email and password', 400));
    }

    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
        return next(new AppError('Invalid credentials', 401));
    }

    if (user.status === 'suspended') {
        return next(new AppError('Account suspended', 403));
    }

    sendTokenResponse(user, 200, res);
});

export const logout = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findById(req.user.id);
    if (user) {
        user.refreshToken = undefined;
        await user.save({ validateBeforeSave: false });
    }

    res.cookie('jwt', 'loggedout', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true,
    });
    res.cookie('refreshToken', 'loggedout', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true,
    });

    res.status(200).json({ success: true, message: 'Logged out successfully' });
});

export const getMe = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findById(req.user.id);
    res.status(200).json({
        success: true,
        user,
    });
});

export const refreshToken = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.refreshToken;

    if (!token) {
        return next(new AppError('Not authorized, no token', 401));
    }

    try {
        const decoded: any = jwt.verify(token, config.jwtRefreshSecret);
        const user = await User.findById(decoded.id);

        if (!user || user.refreshToken !== token) {
            return next(new AppError('Invalid token', 401));
        }

        sendTokenResponse(user, 200, res);
    } catch (error) {
        return next(new AppError('Token expired or invalid', 401));
    }
});

export const forgotPassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;

    if (!email) {
        return next(new AppError('Please provide your email address', 400));
    }

    const user = await User.findOne({ email });

    // Always return 200 to prevent email enumeration
    if (!user) {
        return res.status(200).json({
            success: true,
            message: 'If that email exists, a password reset link has been sent.',
        });
    }

    // Generate raw token and its hash
    const rawToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
    await user.save({ validateBeforeSave: false });

    // Send email with raw token (never store raw token)
    const resetUrl = `${config.clientUrl}/reset-password?token=${rawToken}`;

    try {
        await sendEmail({
            to: user.email,
            subject: 'EcoWaste — Password Reset Request',
            html: passwordResetEmailTemplate(resetUrl),
        });

        res.status(200).json({
            success: true,
            message: 'If that email exists, a password reset link has been sent.',
        });
    } catch (err) {
        // Clear token if email fails
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save({ validateBeforeSave: false });
        return next(new AppError('Email could not be sent. Please try again later.', 500));
    }
});

export const resetPassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
        return next(new AppError('Token and new password are required', 400));
    }

    if (newPassword.length < 8) {
        return next(new AppError('Password must be at least 8 characters', 422));
    }

    // Hash the incoming raw token to compare against stored hash
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
        return next(new AppError('Token is invalid or has expired', 400));
    }

    // Update password and clear reset fields + invalidate all sessions
    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    user.refreshToken = undefined; // Invalidate all existing sessions
    await user.save();

    res.status(200).json({
        success: true,
        message: 'Password updated successfully. Please log in with your new password.',
    });
});
