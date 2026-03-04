import cron from 'node-cron';
import { UserModel as userModel } from '../models/User.model';

export const startQualityRecalculationJob = () => {
    // Run at 3 AM every day
    cron.schedule('0 3 * * *', async () => {
        console.log('[Job:QualityRecalculation] Starting nightly recalculation...');
        try {
            // Find all active citizens
            const citizens = await userModel.find({ role: 'user' }); // Adjust role query as needed

            for (const citizen of citizens) {
                // await qualityScoreService.updateStreak(citizen._id.toString());
                // await qualityScoreService.updateCitizenScore(citizen._id.toString());
            }

            // Find all active kabadiwallas
            const kabadiwallas = await userModel.find({ role: 'kabadiwalla' });
            for (const kb of kabadiwallas) {
                // await qualityScoreService.updateKabadiwalaScore(kb._id.toString());
            }

            console.log(`[Job:QualityRecalculation] Completed for ${citizens.length} citizens and ${kabadiwallas.length} kabadiwallas.`);
        } catch (error) {
            console.error('[Job:QualityRecalculation] Error during recalculation:', error);
        }
    });
};
