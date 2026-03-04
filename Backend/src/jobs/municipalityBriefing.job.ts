import cron from 'node-cron';
import { municipalityBriefingAgent } from '../agents/municipalityBriefing.agent.js';

export const startMunicipalityBriefingJob = () => {
    // Run at 8 AM every Monday
    cron.schedule('0 8 * * 1', async () => {
        console.log('[Job:MunicipalityBriefing] Starting weekly briefings...');
        try {
            // MOCK: Array of ward IDs assuming a structured database
            const activeWards = ['Ward_14', 'Ward_15', 'Ward_16'];
            const municipalityId = 'Admin_Mun_Id_1';

            for (const wardId of activeWards) {
                await municipalityBriefingAgent.generateBriefing(municipalityId, wardId);
            }

            console.log(`[Job:MunicipalityBriefing] Generated briefings for ${activeWards.length} wards.`);
        } catch (error) {
            console.error('[Job:MunicipalityBriefing] Error during briefings:', error);
        }
    });
};
