import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IKabadiwallaTrustScoreDocument extends Document {
    kabadiwallaId: mongoose.Types.ObjectId;
    score: number;
    history: Array<{
        changedAt: Date;
        reason: string;
        oldScore: number;
        newScore: number;
    }>;
    createdAt: Date;
    updatedAt: Date;
}

const KabadiwallaTrustScoreSchema: Schema<IKabadiwallaTrustScoreDocument> = new Schema(
    {
        kabadiwallaId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            unique: true,
        },
        score: {
            type: Number,
            required: true,
            default: 50,
            min: 0,
            max: 100,
        },
        history: [
            {
                changedAt: { type: Date, default: Date.now },
                reason: { type: String, required: true },
                oldScore: { type: Number, required: true },
                newScore: { type: Number, required: true },
            },
        ],
    },
    {
        timestamps: true,
    }
);

export const KabadiwallaTrustScoreModel: Model<IKabadiwallaTrustScoreDocument> = mongoose.models.KabadiwallaTrustScore || mongoose.model<IKabadiwallaTrustScoreDocument>('KabadiwallaTrustScore', KabadiwallaTrustScoreSchema);
