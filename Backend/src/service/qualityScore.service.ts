// import PickupModel from '../models/Pickup.model.js';
// import AnomalyFlagModel from '../models/anomalyFlag.model.js';
// import userModel from '../models/user.model.js';

export const qualityScoreService = {
    updateCitizenScore: async (citizenId: string) => {
        console.log(`[QualityScore] Mock updated citizen ${citizenId}`);
    },

    updateKabadiwalaScore: async (kabadiwalaId: string) => {
        console.log(`[QualityScore] Mock updated kabadiwala ${kabadiwalaId}`);
    },

    updateStreak: async (citizenId: string) => {
        console.log(`[QualityScore] Mock updated streak ${citizenId}`);
    }
};
