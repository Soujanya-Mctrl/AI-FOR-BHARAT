import mongoose, { Document, Schema } from 'mongoose';

export interface ICarbonCreditReport extends Document {
    period: {
        start: Date;
        end: Date;
    };
    wardIds?: string[];
    totalDiversion: number;
    co2Credits: number;
    wardBreakdown?: Array<{
        wardId: string;
        diversion: number;
        co2: number;
        verifiedPickups: number;
    }>;
    methodology?: string;
    format?: 'json' | 'pdf';
    downloadUrl?: string;
    verificationHash?: string;
    generatedBy?: mongoose.Types.ObjectId;
    generatedAt?: Date;
    expiresAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const carbonCreditReportSchema = new Schema<ICarbonCreditReport>(
    {
        period: {
            start: { type: Date, required: true },
            end: { type: Date, required: true },
        },
        wardIds: [String],
        totalDiversion: { type: Number, required: true },
        co2Credits: { type: Number, required: true },
        wardBreakdown: [
            {
                wardId: String,
                diversion: Number,
                co2: Number,
                verifiedPickups: Number,
            },
        ],
        methodology: String,
        format: { type: String, enum: ['json', 'pdf'] },
        downloadUrl: String,
        verificationHash: String,
        generatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
        generatedAt: Date,
        expiresAt: Date,
    },
    {
        timestamps: true,
    }
);

const CarbonCreditReport = mongoose.model<ICarbonCreditReport>(
    'CarbonCreditReport',
    carbonCreditReportSchema
);
export default CarbonCreditReport;
