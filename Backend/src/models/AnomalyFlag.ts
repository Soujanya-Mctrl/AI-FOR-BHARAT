import mongoose, { Document, Schema } from 'mongoose';

export interface IAnomalyFlag extends Document {
    userId: mongoose.Types.ObjectId;
    reportId?: mongoose.Types.ObjectId;
    type: 'gps_mismatch' | 'image_mismatch' | 'frequency_anomaly' | 'quality_drop' | 'time_anomaly';
    severity: 'low' | 'medium' | 'high';
    description?: string;
    resolved: boolean;
    resolution?: {
        decision: 'verified' | 'rejected' | 'suspicious';
        reviewedBy: mongoose.Types.ObjectId;
        notes?: string;
        reviewedAt: Date;
    };
    createdAt: Date;
    updatedAt: Date;
}

const anomalyFlagSchema = new Schema<IAnomalyFlag>(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        reportId: { type: Schema.Types.ObjectId, ref: 'WasteReport' },
        type: {
            type: String,
            enum: ['gps_mismatch', 'image_mismatch', 'frequency_anomaly', 'quality_drop', 'time_anomaly'],
        },
        severity: { type: String, enum: ['low', 'medium', 'high'], required: true },
        description: String,
        resolved: { type: Boolean, default: false },
        resolution: {
            decision: { type: String, enum: ['verified', 'rejected', 'suspicious'] },
            reviewedBy: { type: Schema.Types.ObjectId, ref: 'User' },
            notes: String,
            reviewedAt: Date,
        },
    },
    {
        timestamps: true,
    }
);

const AnomalyFlag = mongoose.model<IAnomalyFlag>('AnomalyFlag', anomalyFlagSchema);
export default AnomalyFlag;
