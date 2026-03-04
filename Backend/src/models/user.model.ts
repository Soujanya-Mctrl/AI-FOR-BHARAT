import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
    username?: string;
    name?: string;
    email: string;
    emailVerified?: boolean;
    image?: string;
    password?: string;
    points: number;
    reliabilityScore: number;
    monitoringLevel: 'standard' | 'enhanced' | 'strict';
    monitoringExpiresAt?: Date;
    currentStreak: number;
    longestStreak: number;
    citizenProfile?: {
        segregationScore: number;
        cashbackBalance: number;
    };
    kabadiwalaProfile?: {
        accuracyScore: number;
        isSuspended: boolean;
        suspendReason?: string;
        isBanned: boolean;
        banReason?: string;
        banEvidence?: string[];
    };
    role: 'user' | 'green_champion' | 'admin';
    createdAt: Date;
    updatedAt: Date;
}

const userSchema: Schema = new Schema({
    username: {
        type: String,
        required: false,
        unique: true,
        trim: true,
        minlength: 3,
        maxlength: 30
    },
    name: {
        type: String,
        required: false
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    emailVerified: {
        type: Boolean,
        required: false,
        default: false
    },
    image: {
        type: String,
        required: false
    },
    password: {
        type: String,
        required: false,
        minlength: 8
    },
    points: {
        type: Number,
        default: 0,
        min: 0
    },
    reliabilityScore: { type: Number, default: 100, min: 0, max: 100 },
    monitoringLevel: { type: String, enum: ['standard', 'enhanced', 'strict'], default: 'standard' },
    monitoringExpiresAt: { type: Date },
    currentStreak: { type: Number, default: 0 },
    longestStreak: { type: Number, default: 0 },
    citizenProfile: {
        segregationScore: { type: Number, default: 100, min: 0, max: 100 },
        cashbackBalance: { type: Number, default: 0, min: 0 }
    },
    kabadiwalaProfile: {
        accuracyScore: { type: Number, default: 100, min: 0, max: 100 },
        isSuspended: { type: Boolean, default: false },
        suspendReason: { type: String },
        isBanned: { type: Boolean, default: false },
        banReason: { type: String },
        banEvidence: [{ type: String }]
    },
    role: {
        type: String,
        enum: ['user', 'green_champion', 'admin'],
        default: 'user'
    }
}, { timestamps: true });

const userModel = mongoose.model<IUser>("users", userSchema);

export default userModel;
