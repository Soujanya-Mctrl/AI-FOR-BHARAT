import mongoose, { Document, Schema } from 'mongoose';

export interface IPointsTransaction extends Document {
    userId: mongoose.Types.ObjectId;
    type: 'earned' | 'redeemed' | 'bonus';
    pointType: 'eco' | 'green';
    amount: number;
    source?: string;
    description?: string;
    relatedEntity?: mongoose.Types.ObjectId;
    redemptionDetails?: {
        method: 'upi_cashback' | 'utility_discount';
        upiId?: string;
        transactionRef?: string;
        discountCode?: string;
        status: 'processing' | 'completed' | 'failed';
    };
    createdAt: Date;
    updatedAt: Date;
}

const pointsTransactionSchema = new Schema<IPointsTransaction>(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        type: { type: String, enum: ['earned', 'redeemed', 'bonus'], required: true },
        pointType: { type: String, enum: ['eco', 'green'], required: true },
        amount: { type: Number, required: true },
        source: String,
        description: String,
        relatedEntity: { type: Schema.Types.ObjectId },
        redemptionDetails: {
            method: { type: String, enum: ['upi_cashback', 'utility_discount'] },
            upiId: String,
            transactionRef: String,
            discountCode: String,
            status: { type: String, enum: ['processing', 'completed', 'failed'] },
        },
    },
    {
        timestamps: true,
    }
);

const PointsTransaction = mongoose.model<IPointsTransaction>('PointsTransaction', pointsTransactionSchema);
export default PointsTransaction;
