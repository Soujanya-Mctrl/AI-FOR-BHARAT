import mongoose, { Document, Model, Schema } from 'mongoose';
import { IReport } from '../types';

export interface IWasteReportDocument extends Omit<IReport, '_id'>, Document { }

const WasteReportSchema: Schema<IWasteReportDocument> = new Schema(
    {
        reporterId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        imageUrl: {
            type: String,
            required: true,
        },
        location: {
            lat: {
                type: Number,
                required: true,
            },
            lng: {
                type: Number,
                required: true,
            },
            address: {
                type: String,
                required: true,
            },
        },
        status: {
            type: String,
            enum: ['pending', 'verified', 'cleaned', 'rejected'],
            default: 'pending',
        },
    },
    {
        timestamps: true,
    }
);

export const WasteReportModel: Model<IWasteReportDocument> = mongoose.models.WasteReport || mongoose.model<IWasteReportDocument>('WasteReport', WasteReportSchema);
