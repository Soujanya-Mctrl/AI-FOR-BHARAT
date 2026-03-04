import PickupModel from '../models/Pickup.model.js';
import AnomalyFlagModel from '../models/anomalyFlag.model.js';
import userModel from '../models/user.model.js';
import { notificationService } from './notification.service.js';

export const qualityScoreService = {
    updateCitizenScore: async (citizenId: string) => {
        // 1. Fetch last 30 kabadiwalla quality ratings for this citizen
        const recentPickups = await PickupModel.find({
            citizenId,
            kabadiwalaQualityRating: { $exists: true }
        })
            .sort({ createdAt: -1 })
            .limit(30);

        if (recentPickups.length === 0) return;

        // 2. Map to numbers and calculate weighted rolling average
        let totalWeight = 0;
        let weightedSum = 0;

        recentPickups.forEach((pickup, index) => {
            let score = 0;
            if (pickup.kabadiwalaQualityRating === 'good') score = 100;
            else if (pickup.kabadiwalaQualityRating === 'acceptable') score = 70;
            else if (pickup.kabadiwalaQualityRating === 'poor') score = 30;

            // More recent pickups carry slightly higher weight (decaying weight)
            const weight = 30 - index;
            weightedSum += score * weight;
            totalWeight += weight;
        });

        let segregationScore = Math.round(weightedSum / totalWeight);

        // 3. Apply streak bonus
        const user = await userModel.findById(citizenId);
        if (user && user.currentStreak >= 7) {
            segregationScore += 5;
        }

        // 4. Apply fraud penalty (-15 per active anomaly flag in last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const activeFlagsCount = await AnomalyFlagModel.countDocuments({
            userId: citizenId,
            status: 'active',
            createdAt: { $gte: thirtyDaysAgo }
        });

        segregationScore -= (activeFlagsCount * 15);

        // 5. Clamp to 0-100
        segregationScore = Math.max(0, Math.min(100, segregationScore));

        // 6. Update citizenProfile.segregationScore
        if (user) {
            const oldScore = user.citizenProfile?.segregationScore || 100;
            await userModel.findByIdAndUpdate(citizenId, {
                'citizenProfile.segregationScore': segregationScore
            });

            if (segregationScore > oldScore) {
                await notificationService.scoreImproved(citizenId, segregationScore, oldScore);
            }
        }
    },

    updateKabadiwalaScore: async (kabadiwalaId: string) => {
        // Stub for full kabadiwala score calculation
        // Requires computing onTimeArrivalRate(35%), citizenRatingAverage(35%), routeCompletionRate(20%), selfAssessmentAccuracy(10%)
        const kabadiwala = await userModel.findById(kabadiwalaId);

        const onTimeArrivalRate = 90; // mock
        const citizenRatingAverage = 4.5 * 20; // 90 / 100
        const routeCompletionRate = 95; // mock
        const selfAssessmentAccuracy = 80; // mock

        let accuracyScore = (onTimeArrivalRate * 0.35) + (citizenRatingAverage * 0.35) + (routeCompletionRate * 0.20) + (selfAssessmentAccuracy * 0.10);
        accuracyScore = Math.round(accuracyScore);

        if (kabadiwala) {
            const oldScore = kabadiwala.kabadiwalaProfile?.accuracyScore || 100;
            await userModel.findByIdAndUpdate(kabadiwalaId, {
                'kabadiwalaProfile.accuracyScore': accuracyScore,
                'reliabilityScore': accuracyScore // mirrored
            });

            if (accuracyScore > oldScore) {
                await notificationService.scoreImproved(kabadiwalaId, accuracyScore, oldScore);
            }
        }
    },

    updateStreak: async (citizenId: string) => {
        const user = await userModel.findById(citizenId);
        if (!user) return;

        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        yesterday.setHours(0, 0, 0, 0);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const hadPickupYesterday = await PickupModel.exists({
            citizenId,
            status: 'completed',
            updatedAt: { $gte: yesterday, $lt: today }
        });

        if (hadPickupYesterday) {
            user.currentStreak += 1;
            if (user.currentStreak > user.longestStreak) {
                user.longestStreak = user.currentStreak;
            }
        } else {
            user.currentStreak = 0;
        }

        await user.save();

        if (user.currentStreak > 0 && user.currentStreak % 7 === 0) {
            await notificationService.streakMilestone(citizenId, user.currentStreak);
        }
    }
};
