import mongoose, { Document, Schema } from 'mongoose';

export interface IQualityScore extends Document {
    pickupId: mongoose.Types.ObjectId;
    overall: number;
    segregation: number;
    imageMatch: number;
    gpsAccuracy: number;
    timeCompliance: number;
    crossRefScore?: number;
    anomalyDetected: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const qualityScoreSchema = new Schema<IQualityScore>(
    {
        pickupId: { type: Schema.Types.ObjectId, ref: 'PickupRequest', required: true },
        overall: { type: Number, min: 0, max: 100 },
        segregation: { type: Number, min: 0, max: 100 },
        imageMatch: { type: Number, min: 0, max: 100 },
        gpsAccuracy: { type: Number, min: 0, max: 100 },
        timeCompliance: { type: Number, min: 0, max: 100 },
        crossRefScore: Number,
        anomalyDetected: { type: Boolean, default: false },
    },
    {
        timestamps: true,
    }
);

const QualityScore = mongoose.model<IQualityScore>('QualityScore', qualityScoreSchema);
export default QualityScore;
