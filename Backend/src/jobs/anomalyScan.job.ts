import cron from 'node-cron';
import { anomalyInvestigatorAgent } from '../agents/anomalyInvestigator.agent.js';
import InvestigationModel from '../models/Investigation.model.js';

export const startAnomalyScanJob = () => {
    // Run at 2 AM every day
    cron.schedule('0 2 * * *', async () => {
        console.log('[Job:AnomalyScan] Starting nightly anomaly scan...');
        try {
            // Find all pending investigations
            const pendingInvestigations = await InvestigationModel.find({ status: 'pending' });

            console.log(`[Job:AnomalyScan] Found ${pendingInvestigations.length} pending investigations.`);

            for (const inv of pendingInvestigations) {
                await anomalyInvestigatorAgent.investigateAnomaly((inv as any)._id.toString());
            }

            console.log('[Job:AnomalyScan] Nightly anomaly scan completed.');
        } catch (error) {
            console.error('[Job:AnomalyScan] Error during scan:', error);
        }
    });
};
