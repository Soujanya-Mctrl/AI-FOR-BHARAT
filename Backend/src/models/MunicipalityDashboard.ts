import mongoose, { Document, Schema } from 'mongoose';

export interface IMunicipalityDashboard extends Document {
    wardId: string;
    date: Date;
    complianceRate?: number;
    totalPickups?: number;
    verifiedPickups?: number;
    segregationRate?: number;
    activeKabadiwallas?: number;
    totalHouseholds?: number;
    activeHouseholds?: number;
    ecoScore?: number;
    unresolvedReports?: number;
    topColonies?: Array<{ name: string; ecoScore: number }>;
    worstAreas?: Array<{ name: string; ecoScore: number; unresolvedReports: number }>;
    createdAt: Date;
    updatedAt: Date;
}

const municipalityDashboardSchema = new Schema<IMunicipalityDashboard>(
    {
        wardId: { type: String, required: true },
        date: { type: Date, required: true },
        complianceRate: Number,
        totalPickups: Number,
        verifiedPickups: Number,
        segregationRate: Number,
        activeKabadiwallas: Number,
        totalHouseholds: Number,
        activeHouseholds: Number,
        ecoScore: Number,
        unresolvedReports: Number,
        topColonies: [{ name: String, ecoScore: Number }],
        worstAreas: [{ name: String, ecoScore: Number, unresolvedReports: Number }],
    },
    {
        timestamps: true,
    }
);

const MunicipalityDashboard = mongoose.model<IMunicipalityDashboard>(
    'MunicipalityDashboard',
    municipalityDashboardSchema
);
export default MunicipalityDashboard;
