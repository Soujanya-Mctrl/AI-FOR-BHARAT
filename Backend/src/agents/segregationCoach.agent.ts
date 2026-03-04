import { GoogleGenerativeAI } from '@google/generative-ai';
import PickupModel from '../models/PickupRequest';
// import { notificationService } from '../service/notification.service';

// Initialize Gemini (ensure GEMINI_API_KEY is in .env)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export const segregationCoachAgent = {
    coachCitizen: async (pickupId: string) => {
        try {
            // 1. Gather context
            const pickup = await PickupModel.findById(pickupId).populate('reportId');
            if (!pickup) throw new Error("Pickup not found");

            // In a real scenario, we'd fetch the actual image URL from the report
            // const report = pickup.reportId as any;
            // const imageUrl = report.imageUrl;

            const citizenId = pickup.citizenId.toString();

            // Mock recent ratings for context
            const recentPickups = await PickupModel.find({ citizenId, status: 'completed' })
                .sort({ createdAt: -1 })
                .limit(10);

            let goodCount = 0;
            recentPickups.forEach(p => {
                if (p.segregationQuality === 'good') goodCount++;
            });

            // 2. Analyze waste photo with Gemini Vision (Mocked for now)
            // In production:
            // const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
            // const prompt = "Identify specific segregation mistake visible in this waste photo. Return ONLY the specific issue.";
            // const result = await model.generateContent([prompt, imagePart]);
            // const specificIssue = result.response.text();

            const specificIssue = "plastic bottles in wet waste bin"; // Stubbed AI response

            // 3. Generate personalized message
            const coachModel = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
            const prompt = `
        You are a friendly, non-judgmental waste segregation coach.
        The citizen just had a pickup rated as "${pickup.segregationQuality}".
        They have had ${goodCount} "good" ratings out of their last ${recentPickups.length} pickups.
        The specific mistake identified in their waste photo was: "${specificIssue}".
        
        Write a short (max 3 sentences), encouraging message informing them of the mistake,
        telling them exactly how to fix it next time, and praising their historical performance
        if they have mostly good ratings. DO NOT sound like a robot.
      `;

            // const result = await coachModel.generateContent(prompt);
            // const message = result.response.text();

            // Stubbed message to save API calls during dev:
            const message = `Your last pickup got an Acceptable rating. It looks like there were some ${specificIssue}. Plastic packaging — even food-stained — goes in the blue bin. You're doing well overall — ${goodCount} of your last ${recentPickups.length} pickups were rated Good!`;

            console.log(`[SegregationCoach] Generated message for ${citizenId}: ${message}`);

            // 4. Deliver
            // await notificationService.pickupConfirmed(citizenId, 0); // Trigger standard confirmed notice
            // Assuming a more specific notification for coaching:
            // await notificationService.sendCoachingMessage(citizenId, message, photoUrl);

        } catch (error) {
            console.error("[SegregationCoach] Error coaching citizen:", error);
        }
    }
};
import { GoogleGenerativeAI } from '@google/generative-ai';
import PickupModel from '../models/Pickup.model.js';
import { notificationService } from '../service/notification.service.js';

// Initialize Gemini (ensure GEMINI_API_KEY is in .env)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export const segregationCoachAgent = {
    coachCitizen: async (pickupId: string) => {
        try {
            // 1. Gather context
            const pickup = await PickupModel.findById(pickupId).populate('reportId');
            if (!pickup) throw new Error("Pickup not found");

            // In a real scenario, we'd fetch the actual image URL from the report
            // const report = pickup.reportId as any;
            // const imageUrl = report.imageUrl;

            const citizenId = pickup.citizenId.toString();

            // Mock recent ratings for context
            const recentPickups = await PickupModel.find({ citizenId, status: 'completed' })
                .sort({ createdAt: -1 })
                .limit(10);

            let goodCount = 0;
            recentPickups.forEach(p => {
                if (p.kabadiwalaQualityRating === 'good') goodCount++;
            });

            // 2. Analyze waste photo with Gemini Vision (Mocked for now)
            // In production:
            // const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
            // const prompt = "Identify specific segregation mistake visible in this waste photo. Return ONLY the specific issue.";
            // const result = await model.generateContent([prompt, imagePart]);
            // const specificIssue = result.response.text();

            const specificIssue = "plastic bottles in wet waste bin"; // Stubbed AI response

            // 3. Generate personalized message
            const coachModel = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
            const prompt = `
        You are a friendly, non-judgmental waste segregation coach.
        The citizen just had a pickup rated as "${pickup.kabadiwalaQualityRating}".
        They have had ${goodCount} "good" ratings out of their last ${recentPickups.length} pickups.
        The specific mistake identified in their waste photo was: "${specificIssue}".
        
        Write a short (max 3 sentences), encouraging message informing them of the mistake,
        telling them exactly how to fix it next time, and praising their historical performance
        if they have mostly good ratings. DO NOT sound like a robot.
      `;

            // const result = await coachModel.generateContent(prompt);
            // const message = result.response.text();

            // Stubbed message to save API calls during dev:
            const message = `Your last pickup got an Acceptable rating. It looks like there were some ${specificIssue}. Plastic packaging — even food-stained — goes in the blue bin. You're doing well overall — ${goodCount} of your last ${recentPickups.length} pickups were rated Good!`;

            console.log(`[SegregationCoach] Generated message for ${citizenId}: ${message}`);

            // 4. Deliver
            await notificationService.pickupConfirmed(citizenId, 0); // Trigger standard confirmed notice
            // Assuming a more specific notification for coaching:
            // await notificationService.sendCoachingMessage(citizenId, message, photoUrl);

        } catch (error) {
            console.error("[SegregationCoach] Error coaching citizen:", error);
        }
    }
};
