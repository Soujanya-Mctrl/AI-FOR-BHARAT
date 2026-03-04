import mongoose, { Document, Schema } from 'mongoose';

export interface IWasteReport extends Document {
    citizenId: mongoose.Types.ObjectId;
    imageUrl: string;
    wasteType?: string;
    location: {
        lat: number;
        lng: number;
        address?: string;
        pincode?: string;
    };
    verificationStatus: 'pending' | 'kabadiwalla_confirmed' | 'verified' | 'suspicious' | 'rejected';
    aiClassification?: string;
    pickupId?: mongoose.Types.ObjectId;
    anomalyFlags?: mongoose.Types.ObjectId[];
    validationVotes?: Array<{
        validatorId: mongoose.Types.ObjectId;
        vote: 'verified' | 'suspicious';
        votedAt: Date;
    }>;
    createdAt: Date;
    updatedAt: Date;
}

const wasteReportSchema = new Schema<IWasteReport>(
    {
        citizenId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        imageUrl: { type: String, required: true },
        wasteType: { type: String, default: 'unclassified' },
        location: {
            lat: { type: Number, required: true },
            lng: { type: Number, required: true },
            address: String,
            pincode: String,
        },
        verificationStatus: {
            type: String,
            enum: ['pending', 'kabadiwalla_confirmed', 'verified', 'suspicious', 'rejected'],
            default: 'pending',
        },
        aiClassification: { type: String },
        pickupId: { type: Schema.Types.ObjectId, ref: 'PickupRequest' },
        anomalyFlags: [{ type: Schema.Types.ObjectId, ref: 'AnomalyFlag' }],
        validationVotes: [
            {
                validatorId: { type: Schema.Types.ObjectId, ref: 'User' },
                vote: { type: String, enum: ['verified', 'suspicious'] },
                votedAt: Date,
            },
        ],
    },
    {
        timestamps: true,
    }
);

const WasteReport = mongoose.model<IWasteReport>('WasteReport', wasteReportSchema);
export default WasteReport;
