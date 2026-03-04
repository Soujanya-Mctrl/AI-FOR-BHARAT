import mongoose, { Document, Schema } from 'mongoose';

export interface IKabadiwallaTrustScore extends Document {
    userId: mongoose.Types.ObjectId;
    overallScore: number;
    breakdown: {
        pickupCompletionRate: number;
        onTimeRate: number;
        citizenRatings: number;
        routeEfficiency: number;
        segregationAccuracy: number;
        penalties: number;
    };
    history?: Array<{
        date: Date;
        score: number;
        change: number;
        reason: string;
    }>;
    isOverridden: boolean;
    overrideInfo?: {
        previousScore: number;
        overriddenBy: mongoose.Types.ObjectId;
        reason: string;
        overriddenAt: Date;
    };
    lastCalculatedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const kabadiwallaTrustScoreSchema = new Schema<IKabadiwallaTrustScore>(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
        overallScore: { type: Number, default: 50, min: 0, max: 100 },
        breakdown: {
            pickupCompletionRate: { type: Number, default: 0 },
            onTimeRate: { type: Number, default: 0 },
            citizenRatings: { type: Number, default: 0 },
            routeEfficiency: { type: Number, default: 0 },
            segregationAccuracy: { type: Number, default: 0 },
            penalties: { type: Number, default: 0 },
        },
        history: [
            {
                date: Date,
                score: Number,
                change: Number,
                reason: String,
            },
        ],
        isOverridden: { type: Boolean, default: false },
        overrideInfo: {
            previousScore: Number,
            overriddenBy: { type: Schema.Types.ObjectId, ref: 'User' },
            reason: String,
            overriddenAt: Date,
        },
        lastCalculatedAt: Date,
    },
    {
        timestamps: true,
    }
);

const KabadiwallaTrustScore = mongoose.model<IKabadiwallaTrustScore>(
    'KabadiwallaTrustScore',
    kabadiwallaTrustScoreSchema
);
export default KabadiwallaTrustScore;
