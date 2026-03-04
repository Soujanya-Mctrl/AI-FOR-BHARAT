import mongoose, { Document, Schema } from 'mongoose';

export interface IPickupRequest extends Document {
    citizenId: mongoose.Types.ObjectId;
    kabadiwalaId?: mongoose.Types.ObjectId;
    status: 'pending' | 'accepted' | 'completed' | 'cancelled' | 'declined';
    scheduledDate: Date;
    scheduledTimeSlot: 'morning' | 'afternoon' | 'evening';
    wasteType: string;
    location: {
        lat: number;
        lng: number;
        address?: string;
    };
    completionLocation?: {
        lat: number;
        lng: number;
    };
    segregationQuality?: 'good' | 'acceptable' | 'poor';
    citizenRating?: number;
    ratingComment?: string;
    proofImage?: string;
    notes?: string;
    cancelReason?: string;
    declineReason?: string;
    completedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const pickupRequestSchema = new Schema<IPickupRequest>(
    {
        citizenId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        kabadiwalaId: { type: Schema.Types.ObjectId, ref: 'User' },
        status: {
            type: String,
            enum: ['pending', 'accepted', 'completed', 'cancelled', 'declined'],
            default: 'pending',
        },
        scheduledDate: { type: Date, required: true },
        scheduledTimeSlot: {
            type: String,
            enum: ['morning', 'afternoon', 'evening'],
            required: true,
        },
        wasteType: { type: String, required: true },
        location: {
            lat: { type: Number, required: true },
            lng: { type: Number, required: true },
            address: String,
        },
        completionLocation: { lat: Number, lng: Number },
        segregationQuality: { type: String, enum: ['good', 'acceptable', 'poor'] },
        citizenRating: { type: Number, min: 1, max: 5 },
        ratingComment: String,
        proofImage: String,
        notes: String,
        cancelReason: String,
        declineReason: String,
        completedAt: Date,
    },
    {
        timestamps: true,
    }
);

const PickupRequest = mongoose.model<IPickupRequest>('PickupRequest', pickupRequestSchema);
export default PickupRequest;
