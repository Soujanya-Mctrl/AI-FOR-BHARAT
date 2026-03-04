import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IQualityScoreDocument extends Document {
    pickupId: mongoose.Types.ObjectId;
    kabadiwallaId: mongoose.Types.ObjectId;
    citizenId: mongoose.Types.ObjectId;
    segregationScore: number; // 0-100
    weightAccuracyScore: number; // 0-100
    overallScore: number; // Average
    aiNotes?: string;
    createdAt: Date;
    updatedAt: Date;
}

const QualityScoreSchema: Schema<IQualityScoreDocument> = new Schema(
    {
        pickupId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'PickupRequest',
            required: true,
        },
        kabadiwallaId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        citizenId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        segregationScore: {
            type: Number,
            required: true,
            min: 0,
            max: 100,
        },
        weightAccuracyScore: {
            type: Number,
            required: true,
            min: 0,
            max: 100,
        },
        overallScore: {
            type: Number,
            required: true,
            min: 0,
            max: 100,
        },
        aiNotes: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

export const QualityScoreModel: Model<IQualityScoreDocument> = mongoose.models.QualityScore || mongoose.model<IQualityScoreDocument>('QualityScore', QualityScoreSchema);
