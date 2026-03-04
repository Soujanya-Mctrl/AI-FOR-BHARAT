import mongoose, { Document, Model, Schema } from 'mongoose';
import { IPickup } from '../types';

export interface IPickupRequestDocument extends Omit<IPickup, '_id'>, Document { }

const PickupRequestSchema: Schema<IPickupRequestDocument> = new Schema(
    {
        citizenId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        kabadiwallaId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        status: {
            type: String,
            enum: ['pending', 'accepted', 'completed', 'cancelled'],
            default: 'pending',
        },
        scheduledTime: {
            type: Date,
            required: true,
        },
        address: {
            street: { type: String, required: true },
            city: { type: String, required: true },
            coordinates: {
                lat: { type: Number, required: true },
                lng: { type: Number, required: true },
            },
        },
    },
    {
        timestamps: true,
    }
);

export const PickupRequestModel: Model<IPickupRequestDocument> = mongoose.models.PickupRequest || mongoose.model<IPickupRequestDocument>('PickupRequest', PickupRequestSchema);
