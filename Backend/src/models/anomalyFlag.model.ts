import mongoose, { Document, Schema } from "mongoose";

export interface IAnomalyFlag extends Document {
    userId: mongoose.Types.ObjectId;
    flagType: string;
    severity: 'low' | 'medium' | 'high';
    status: 'active' | 'resolved' | 'dismissed';
    context?: any;
    createdAt: Date;
    updatedAt: Date;
}

const anomalyFlagSchema: Schema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'users', required: true },
    flagType: { type: String, required: true },
    severity: { type: String, enum: ['low', 'medium', 'high'], required: true },
    status: { type: String, enum: ['active', 'resolved', 'dismissed'], default: 'active' },
    context: { type: Schema.Types.Mixed }
}, { timestamps: true });

const AnomalyFlagModel = mongoose.model<IAnomalyFlag>("anomalyFlags", anomalyFlagSchema);

export default AnomalyFlagModel;
