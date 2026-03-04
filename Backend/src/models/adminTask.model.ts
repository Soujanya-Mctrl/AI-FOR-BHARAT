import mongoose, { Document, Schema } from "mongoose";

export interface IAdminTask extends Document {
    type: 'SUSPEND_PENDING_REVIEW' | 'OTHER';
    targetUser: mongoose.Types.ObjectId;
    investigationId?: mongoose.Types.ObjectId;
    status: 'pending' | 'resolved';
    deadline: Date;
    resolvedBy?: mongoose.Types.ObjectId;
    resolutionNotes?: string;
    createdAt: Date;
    updatedAt: Date;
}

const adminTaskSchema: Schema = new Schema({
    type: { type: String, enum: ['SUSPEND_PENDING_REVIEW', 'OTHER'], required: true },
    targetUser: { type: Schema.Types.ObjectId, ref: 'users', required: true },
    investigationId: { type: Schema.Types.ObjectId, ref: 'investigations' },
    status: { type: String, enum: ['pending', 'resolved'], default: 'pending' },
    deadline: { type: Date, required: true },
    resolvedBy: { type: Schema.Types.ObjectId, ref: 'users' },
    resolutionNotes: { type: String }
}, { timestamps: true });

const AdminTaskModel = mongoose.model<IAdminTask>("adminTasks", adminTaskSchema);

export default AdminTaskModel;
