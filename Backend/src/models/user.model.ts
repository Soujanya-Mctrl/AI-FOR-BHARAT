import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IUserDocument extends Document {
    role: 'citizen' | 'kabadiwalla' | 'municipality' | 'admin';
    phoneNumber?: string;
    email?: string;
    password?: string;
    username?: string;

    trustScore?: number;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema: Schema<IUserDocument> = new Schema(
    {
        role: {
            type: String,
            enum: ['citizen', 'kabadiwalla', 'municipality', 'admin'],
            required: true,
        },
        phoneNumber: {
            type: String,
            unique: true,
            sparse: true,
        },
        email: {
            type: String,
            unique: true,
            sparse: true,
        },
        password: {
            type: String,
            select: false,
        },
        username: {
            type: String,
        },

        trustScore: {
            type: Number,
            default: 50,
        },
    },
    {
        timestamps: true,
    }
);

import bcrypt from 'bcryptjs';

UserSchema.pre('save', async function (next) {
    if (!this.isModified('password') || !this.password) {
        return next();
    }
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error as Error);
    }
});

export const UserModel: Model<IUserDocument> = mongoose.models.User || mongoose.model<IUserDocument>('User', UserSchema);
