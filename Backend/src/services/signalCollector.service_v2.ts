import InvestigationModel from '../models/investigation.model.js';
import PickupModel from '../models/Pickup.model.js';
import userModel from '../models/user.model.js';

export const signalCollectorService = {
    queueForInvestigation: async (pickupId: string, kabadiwalaId: string, citizenId: string) => {
        const signals: string[] = [];
        let isHighSeverity = false;

        // 1. velocityCheck()
        const sixtyMinsAgo = new Date();
        sixtyMinsAgo.setMinutes(sixtyMinsAgo.getMinutes() - 60);

        const recentCount = await PickupModel.countDocuments({
            kabadiwalaId,
            status: 'confirmed',
            updatedAt: { $gte: sixtyMinsAgo }
        });

        if (recentCount > 12) {
            signals.push('HIGH_VELOCITY_HIGH_SEVERITY');
            isHighSeverity = true;
        } else if (recentCount > 8) {
            signals.push('HIGH_VELOCITY_MEDIUM_SEVERITY');
        }

        // 2. movementCheck()
        // Skip for now without full GPS trajectory data
        // Implied speed > 40km/h: IMPOSSIBLE_MOVEMENT

        // 3. dwellUniformityCheck()
        const last10Pickups = await PickupModel.find({ kabadiwalaId, status: 'confirmed' })
            .sort({ updatedAt: -1 })
            .limit(10)
            .select('kabadiwalaArrival.dwellTimeMinutes');

        if (last10Pickups.length === 10) {
            const dwellTimes = last10Pickups.map(p => p.kabadiwalaArrival?.dwellTimeMinutes || 0);
            const mean = dwellTimes.reduce((a, b) => a + b) / 10;
            const variance = dwellTimes.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / 10;
            const stdDev = Math.sqrt(variance);

            if (stdDev < 0.3) {
                signals.push('UNIFORM_DWELL_MEDIUM_SEVERITY');
            }
        }

        // 4. newAccountCheck()
        const user = await userModel.findById(kabadiwalaId);
        if (user) {
            const ageInDays = (new Date().getTime() - user.createdAt.getTime()) / (1000 * 3600 * 24);
            const totalPickups = await PickupModel.countDocuments({ kabadiwalaId, status: 'confirmed' });

            if (ageInDays < 7 && totalPickups > 15) {
                signals.push('NEW_ACCOUNT_ABUSE_HIGH_SEVERITY');
                isHighSeverity = true;
            }
        }

        if (signals.length > 0) {
            await InvestigationModel.create({
                targetUser: kabadiwalaId,
                signals,
                priority: isHighSeverity,
                status: 'pending'
            });
            console.log(`[SignalCollector] Queued investigation for ${kabadiwalaId} with ${signals.length} signals.`);
        }
    }
};
