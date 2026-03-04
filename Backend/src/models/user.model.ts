import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
    username?: string;
    name?: string;
    email: string;
    emailVerified?: boolean;
    image?: string;
    password?: string;
    points: number;
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
    role: {
        type: String,
        enum: ['user', 'green_champion', 'admin'],
        default: 'user'
    }
}, { timestamps: true });

const userModel = mongoose.model<IUser>("users", userSchema);

export default userModel;
