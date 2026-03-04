import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IAnomalyFlagDocument extends Document {
    userId: mongoose.Types.ObjectId;
    flagType: 'gps_spoofing' | 'weight_mismatch' | 'velocity_anomaly' | 'image_reuse';
    severity: 'low' | 'medium' | 'high' | 'critical';
    description: string;
    aiAnalysis?: string;
    status: 'open' | 'investigating' | 'resolved' | 'false_positive';
    createdAt: Date;
    updatedAt: Date;
}

const AnomalyFlagSchema: Schema<IAnomalyFlagDocument> = new Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        flagType: {
            type: String,
            enum: ['gps_spoofing', 'weight_mismatch', 'velocity_anomaly', 'image_reuse'],
            required: true,
        },
        severity: {
            type: String,
            enum: ['low', 'medium', 'high', 'critical'],
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        aiAnalysis: {
            type: String,
        },
        status: {
            type: String,
            enum: ['open', 'investigating', 'resolved', 'false_positive'],
            default: 'open',
        },
    },
    {
        timestamps: true,
    }
);

export const AnomalyFlagModel: Model<IAnomalyFlagDocument> = mongoose.models.AnomalyFlag || mongoose.model<IAnomalyFlagDocument>('AnomalyFlag', AnomalyFlagSchema);
