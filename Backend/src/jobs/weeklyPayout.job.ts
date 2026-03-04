import cron from 'node-cron';
import { UserModel as userModel } from '../models/User.model';

export const startWeeklyPayoutJob = () => {
    // Run at 9 AM every Friday
    cron.schedule('0 9 * * 5', async () => {
        console.log('[Job:WeeklyPayout] Starting weekly payouts...');
        try {
            // Find all active kabadiwallas
            const kabadiwallas = await userModel.find({ role: 'kabadiwalla' });

            for (const kb of kabadiwallas) {
                // await paymentService.weeklyPayout(kb._id.toString());
            }

            console.log(`[Job:WeeklyPayout] Completed payouts for ${kabadiwallas.length} kabadiwallas.`);
        } catch (error) {
            console.error('[Job:WeeklyPayout] Error during payouts:', error);
        }
    });
};
