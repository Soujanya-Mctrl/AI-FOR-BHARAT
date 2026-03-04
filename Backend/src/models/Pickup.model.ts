import mongoose, { Document, Schema } from "mongoose";

export interface IPickup extends Document {
    citizenId: mongoose.Types.ObjectId;
    kabadiwalaId?: mongoose.Types.ObjectId;
    reportId?: mongoose.Types.ObjectId;
    status: 'requested' | 'accepted' | 'arriving' | 'confirmed' | 'completed' | 'cancelled';
    scheduledWindow: {
        start: Date;
        end: Date;
    };
    citizenLocation: {
        lat: number;
        lng: number;
        address?: string;
    };
    kabadiwalaArrival?: {
        lat: number;
        lng: number;
        arrivedAt: Date;
        dwellTimeMinutes: number;
    };
    citizenRating?: number;
    kabadiwalaQualityRating?: 'good' | 'acceptable' | 'poor';
    crossReferenceResult?: {
        compositeScore: number;
        anomalyFlags: string[];
        processedAt: Date;
    };
    paymentStatus: 'pending' | 'released' | 'withheld' | 'failed';
    paymentAmount?: number;
    cashbackAmount?: number;
    cancelReason?: string;
    createdAt: Date;
    updatedAt: Date;
}

const pickupSchema: Schema = new Schema({
    citizenId: { type: Schema.Types.ObjectId, ref: 'users', required: true },
    kabadiwalaId: { type: Schema.Types.ObjectId, ref: 'users' },
    reportId: { type: Schema.Types.ObjectId, ref: 'reports' },
    status: {
        type: String,
        enum: ['requested', 'accepted', 'arriving', 'confirmed', 'completed', 'cancelled'],
        default: 'requested'
    },
    scheduledWindow: {
        start: { type: Date, required: true },
        end: { type: Date, required: true }
    },
    citizenLocation: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true },
        address: { type: String }
    },
    kabadiwalaArrival: {
        lat: { type: Number },
        lng: { type: Number },
        arrivedAt: { type: Date },
        dwellTimeMinutes: { type: Number }
    },
    citizenRating: { type: Number, min: 1, max: 5 },
    kabadiwalaQualityRating: {
        type: String,
        enum: ['good', 'acceptable', 'poor']
    },
    crossReferenceResult: {
        compositeScore: { type: Number },
        anomalyFlags: [{ type: String }],
        processedAt: { type: Date }
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'released', 'withheld', 'failed'],
        default: 'pending'
    },
    paymentAmount: { type: Number },
    cashbackAmount: { type: Number },
    cancelReason: { type: String }
}, { timestamps: true });

const PickupModel = mongoose.model<IPickup>("pickups", pickupSchema);

export default PickupModel;
