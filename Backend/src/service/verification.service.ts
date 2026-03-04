import { anomalyInvestigator } from '../agents';
import { AnomalyFlagModel } from '../models/AnomalyFlag.model';
import { PickupRequestModel } from '../models/PickupRequest.model';
import { QualityScoreModel } from '../models/QualityScore.model';
import { crossReferenceService } from './crossReference.service';

export class VerificationService {
    static async triggerCrossReference(pickupId: string): Promise<any> {
        const result = await crossReferenceService.processPickup(pickupId);

        // If anomalies were detected by the cross-reference engine
        if (result.anomalyFlags && result.anomalyFlags.length > 0) {
            const pickup = await PickupRequestModel.findById(pickupId);
            if (!pickup || !pickup.kabadiwallaId) return result;

            // Trigger AI Agent investigation
            const investigationResult = await anomalyInvestigator.investigate({
                userId: pickup.kabadiwallaId.toString(),
                pickupId,
                flags: result.anomalyFlags
            });

            // Create official AnomalyFlag record
            await AnomalyFlagModel.create({
                userId: pickup.kabadiwallaId,
                flagType: (result.anomalyFlags[0] as any).type || 'gps_spoofing',
                severity: investigationResult.severity || 'medium',
                description: investigationResult.reasoning || 'Automated anomaly detected',
                aiAnalysis: JSON.stringify(investigationResult),
                status: investigationResult.action === 'suspend' ? 'open' : 'investigating'
            });

            // Update user status through admin service mechanisms if suspended
            if (investigationResult.action === 'suspend') {
                // To be implemented or handled through trust.service
                // AdminService.suspendUser(pickup.kabadiwallaId.toString());
            }
        } else {
            // Create QualityScore if clean
            // Mock data generation since original didn't implement fully
            const pickup = await PickupRequestModel.findById(pickupId);
            if (pickup && pickup.kabadiwallaId) {
                await QualityScoreModel.create({
                    pickupId,
                    kabadiwallaId: pickup.kabadiwallaId,
                    citizenId: pickup.citizenId,
                    segregationScore: 95,
                    weightAccuracyScore: 98,
                    overallScore: result.compositeScore || 96
                });
            }
        }

        return result;
    }
}
