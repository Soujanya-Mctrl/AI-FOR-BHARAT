import mongoose, { Document, Schema } from "mongoose";

export interface IInvestigation extends Document {
    targetUser: mongoose.Types.ObjectId;
    status: 'pending' | 'in_progress' | 'completed' | 'failed';
    signals: string[];
    priority: boolean;
    verdict?: {
        result: 'LEGITIMATE' | 'SUSPICIOUS' | 'FRAUDULENT';
        confidence: number;
        reasoning: string;
        recommendedAction: 'DISMISS' | 'WARN_USER' | 'REDUCE_SCORE' | 'SUSPEND_PENDING_REVIEW' | 'BAN';
        specificEvidence?: string[];
        alternativeExplanation?: string;
        monitoringRecommendation?: string;
    };
    actionTaken?: string;
    createdAt: Date;
    updatedAt: Date;
}

const investigationSchema: Schema = new Schema({
    targetUser: { type: Schema.Types.ObjectId, ref: 'users', required: true },
    status: { type: String, enum: ['pending', 'in_progress', 'completed', 'failed'], default: 'pending' },
    signals: [{ type: String }],
    priority: { type: Boolean, default: false },
    verdict: {
        result: { type: String, enum: ['LEGITIMATE', 'SUSPICIOUS', 'FRAUDULENT'] },
        confidence: { type: Number, min: 0, max: 100 },
        reasoning: { type: String },
        recommendedAction: { type: String, enum: ['DISMISS', 'WARN_USER', 'REDUCE_SCORE', 'SUSPEND_PENDING_REVIEW', 'BAN'] },
        specificEvidence: [{ type: String }],
        alternativeExplanation: { type: String },
        monitoringRecommendation: { type: String }
    },
    actionTaken: { type: String }
}, { timestamps: true });

const InvestigationModel = mongoose.model<IInvestigation>("investigations", investigationSchema);

export default InvestigationModel;
