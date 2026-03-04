// notification.service.ts

// Setup: import { Expo } from 'expo-server-sdk'
// let expo = new Expo();

export const notificationService = {
    pickupRequestNearby: async (kabadiwalaIds: string[], pickupData: any) => {
        console.log(`[NotificationService] Sending pickupRequestNearby to ${kabadiwalaIds.length} kabadiwalas`);
        // Example: "New pickup 400m away in Koregaon Park — ₹12 available"
    },

    pickupAccepted: async (citizenId: string, kabadiwalaName: string, eta: string) => {
        console.log(`[NotificationService] Sending pickupAccepted to ${citizenId}: ${kabadiwalaName} accepted, ETA ${eta}`);
    },

    pickupConfirmed: async (citizenId: string, score: number) => {
        console.log(`[NotificationService] Sending pickupConfirmed to ${citizenId}`);
    },

    paymentReleased: async (kabadiwalaId: string, amount: number) => {
        console.log(`[NotificationService] Sending paymentReleased to ${kabadiwalaId}: ₹${amount}`);
    },

    cashbackEarned: async (citizenId: string, amount: number) => {
        console.log(`[NotificationService] Sending cashbackEarned to ${citizenId}: ₹${amount}`);
    },

    streakMilestone: async (citizenId: string, streakCount: number) => {
        console.log(`[NotificationService] Sending streakMilestone to ${citizenId}: ${streakCount} days`);
    },

    scoreImproved: async (userId: string, newScore: number, oldScore: number) => {
        console.log(`[NotificationService] Sending scoreImproved to ${userId}: ${oldScore} -> ${newScore}`);
    },

    anomalyWarning: async (userId: string) => {
        console.log(`[NotificationService] Sending anomalyWarning to ${userId}`);
    },

    suspensionNotice: async (userId: string) => {
        console.log(`[NotificationService] Sending suspensionNotice to ${userId}`);
    },

    adminAlert: async (adminIds: string[], flagType: string, userId: string) => {
        console.log(`[NotificationService] Sending adminAlert for user ${userId} to ${adminIds.length} admins`);
    }
};
