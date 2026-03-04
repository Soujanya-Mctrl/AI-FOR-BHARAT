import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    phone: string;
    role: 'citizen' | 'kabadiwalla' | 'green_champion' | 'municipality' | 'admin';
    status: 'active' | 'suspended';
    address?: {
        street: string;
        city: string;
        pincode: string;
        lat: number;
        lng: number;
    };
    profilePhoto?: string;
    trustScore: number;
    ecoPoints: number;
    greenPoints: number;
    isGreenChampion: boolean;
    aadhaarVerified: boolean;
    upiId: string;
    upiVerified: boolean;
    serviceAreaPincodes?: string[];
    refreshToken?: string;
    resetPasswordToken?: string;
    resetPasswordExpires?: Date;
    notificationPreferences?: {
        pickupReminders?: boolean;
        streakAlerts?: boolean;
        pointsUpdates?: boolean;
        communityUpdates?: boolean;
        validationAlerts?: boolean;
    };
    expoPushTokens?: Array<{ token: string; platform: string }>;
    createdAt: Date;
    updatedAt: Date;

    matchPassword(enteredPassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        phone: { type: String, required: true },
        role: {
            type: String,
            required: true,
            enum: ['citizen', 'kabadiwalla', 'green_champion', 'municipality', 'admin'],
            default: 'citizen',
        },
        status: { type: String, enum: ['active', 'suspended'], default: 'active' },
        address: {
            street: String,
            city: String,
            pincode: String,
            lat: Number,
            lng: Number,
        },
        profilePhoto: String,
        trustScore: { type: Number, default: 50, min: 0, max: 100 },
        ecoPoints: { type: Number, default: 0 },
        greenPoints: { type: Number, default: 0 },
        isGreenChampion: { type: Boolean, default: false },
        aadhaarVerified: { type: Boolean, default: false },
        upiId: { type: String, unique: true, sparse: true },
        upiVerified: { type: Boolean, default: false },
        serviceAreaPincodes: [String],
        refreshToken: String,
        resetPasswordToken: String,
        resetPasswordExpires: Date,
        notificationPreferences: {
            pickupReminders: { type: Boolean, default: true },
            streakAlerts: { type: Boolean, default: true },
            pointsUpdates: { type: Boolean, default: true },
            communityUpdates: { type: Boolean, default: true },
            validationAlerts: { type: Boolean, default: true },
        },
        expoPushTokens: [{ token: String, platform: String }],
    },
    {
        timestamps: true,
        toJSON: {
            transform: (_doc, ret) => {
                const obj = ret as any;
                delete obj.password;
                delete obj.refreshToken;
                delete obj.resetPasswordToken;
                return obj;
            },
        },
        toObject: {
            transform: (_doc, ret) => {
                const obj = ret as any;
                delete obj.password;
                delete obj.refreshToken;
                delete obj.resetPasswordToken;
                return obj;
            },
        },
    }
);

userSchema.pre('save', async function (next) {
    if (!this.isModified('password') || !this.password) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (enteredPassword: string) {
    return await bcrypt.compare(enteredPassword, this.password || '');
};

const User = mongoose.model<IUser>('User', userSchema);
export default User;
