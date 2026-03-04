import AdminTaskModel from '../models/adminTask.model.js';
import AnomalyFlagModel from '../models/anomalyFlag.model.js';
import InvestigationModel from '../models/investigation.model.js';
import PickupModel from '../models/Pickup.model.js';
import userModel from '../models/user.model.js';
import { notificationService } from './notification.service.js';

export const verdictExecutorService = {
    executeVerdict: async (investigationId: string, verdict: any) => {
        const investigation = await InvestigationModel.findById(investigationId);
        if (!investigation) throw new Error("Investigation not found");

        const userId = investigation.targetUser.toString();
        const action = verdict.recommendedAction;

        switch (action) {
            case 'DISMISS':
                await AnomalyFlagModel.deleteMany({ userId, status: 'active' });
                investigation.actionTaken = 'auto_dismissed';
                break;

            case 'WARN_USER':
                await notificationService.anomalyWarning(userId);
                const warnDate = new Date();
                warnDate.setDate(warnDate.getDate() + 14);
                await userModel.findByIdAndUpdate(userId, {
                    monitoringLevel: 'enhanced',
                    monitoringExpiresAt: warnDate
                });
                investigation.actionTaken = 'warned';
                break;

            case 'REDUCE_SCORE':
                const penalty = Math.round(verdict.confidence / 10) * 5;
                const userToPenalise = await userModel.findById(userId);
                if (userToPenalise) {
                    userToPenalise.reliabilityScore = Math.max(0, userToPenalise.reliabilityScore - penalty);
                    await userToPenalise.save();
                }
                investigation.actionTaken = 'score_reduced';
                break;

            case 'SUSPEND_PENDING_REVIEW':
                await userModel.findByIdAndUpdate(userId, {
                    'kabadiwalaProfile.isSuspended': true,
                    'kabadiwalaProfile.suspendReason': verdict.reasoning
                });
                await notificationService.suspensionNotice(userId);

                const deadline = new Date();
                deadline.setHours(deadline.getHours() + 48);
                await AdminTaskModel.create({
                    type: 'SUSPEND_PENDING_REVIEW',
                    targetUser: investigation.targetUser,
                    investigationId: investigation._id,
                    deadline: deadline
                });

                await notificationService.adminAlert([], 'suspension_review', userId);
                investigation.actionTaken = 'suspended_pending_review';
                break;

            case 'BAN':
                await userModel.findByIdAndUpdate(userId, {
                    'kabadiwalaProfile.isBanned': true,
                    'kabadiwalaProfile.banReason': verdict.reasoning,
                    'kabadiwalaProfile.banEvidence': verdict.specificEvidence
                });

                // Cancel all pending pickups for this kabadiwalla
                await PickupModel.updateMany(
                    { kabadiwalaId: investigation.targetUser, status: { $in: ['accepted', 'arriving'] } },
                    { $set: { status: 'cancelled', cancelReason: 'kabadiwalla_banned' } }
                );
                // Note: Refunds and reassignment logic omitted for brevity
                investigation.actionTaken = 'auto_banned';
                break;
        }

        investigation.status = 'completed';
        investigation.verdict = verdict;
        await investigation.save();

        console.log(`[VerdictExecutor] Executed ${action} for user ${userId}`);
    }
};
