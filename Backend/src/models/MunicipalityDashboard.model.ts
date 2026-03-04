import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IMunicipalityDashboardDocument extends Document {
    wardNumber: string;
    totalWasteCollectedKg: number;
    totalPlasticDivertedKg: number;
    averageSegregationScore: number;
    activeKabadiwallas: number;
    compliantColoniesCount: number;
    date: Date;
    createdAt: Date;
    updatedAt: Date;
}

const MunicipalityDashboardSchema: Schema<IMunicipalityDashboardDocument> = new Schema(
    {
        wardNumber: {
            type: String,
            required: true,
            index: true,
        },
        totalWasteCollectedKg: {
            type: Number,
            default: 0,
        },
        totalPlasticDivertedKg: {
            type: Number,
            default: 0,
        },
        averageSegregationScore: {
            type: Number,
            default: 0,
        },
        activeKabadiwallas: {
            type: Number,
            default: 0,
        },
        compliantColoniesCount: {
            type: Number,
            default: 0,
        },
        date: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

export const MunicipalityDashboardModel: Model<IMunicipalityDashboardDocument> = mongoose.models.MunicipalityDashboard || mongoose.model<IMunicipalityDashboardDocument>('MunicipalityDashboard', MunicipalityDashboardSchema);
