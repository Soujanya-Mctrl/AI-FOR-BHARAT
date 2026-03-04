import { GoogleGenerativeAI } from '@google/generative-ai';
import PickupModel from '../models/PickupRequest';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export const routeOptimizerAgent = {
    optimizeRoute: async (kabadiwalaId: string, date: Date) => {
        try {
            // Step 1 — Gather inputs
            const startOfDay = new Date(date);
            startOfDay.setHours(0, 0, 0, 0);

            const endOfDay = new Date(date);
            endOfDay.setHours(23, 59, 59, 999);

            const pendingPickups = await PickupModel.find({
                kabadiwalaId, // assuming they are pre-assigned or we query an area pool
                status: 'accepted'
                // 'scheduledWindow.start': { $gte: startOfDay, $lte: endOfDay }
            });

            if (pendingPickups.length === 0) return;

            // Map pickups to structured array format for Gemini to interpret visually/spatially
            // Assuming a base start location
            const startLocation = { lat: 18.5204, lng: 73.8567 };

            const stops = pendingPickups.map(p => ({
                id: (p as any)._id.toString(),
                lat: p.location.lat,
                lng: p.location.lng,
                window: p.scheduledDate
            }));

            // Step 2 — Send to Gemini
            // MOCK
            /*
            const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
            const prompt = `Calculate the optimal traveling salesman route for a waste collector given a start location of ${JSON.stringify(startLocation)} and these stops: ${JSON.stringify(stops)}. Consider time constraints. Return as an ordered list of IDs.`;
            const result = await model.generateContent(prompt);
            const orderedIds = JSON.parse(result.response.text());
            */

            // Stubs
            const orderedIds = stops.map(s => s.id);
            const optimizedCount = orderedIds.length;
            const durationHours = (optimizedCount * 25) / 60; // Approx 25 mins per stop

            console.log(`[RouteOptimizer] Optimized ${optimizedCount} stops for kabadiwala ${kabadiwalaId}`);

            // Step 4 — Push to Kabadiwalla
            // await notificationService.routeOptimized(kabadiwalaId, optimizedCount, durationHours);

        } catch (error) {
            console.error("[RouteOptimizer] Error optimizing route:", error);
        }
    }
};
import { GoogleGenerativeAI } from '@google/generative-ai';
import PickupModel from '../models/Pickup.model.js';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export const routeOptimizerAgent = {
    optimizeRoute: async (kabadiwalaId: string, date: Date) => {
        try {
            // Step 1 — Gather inputs
            const startOfDay = new Date(date);
            startOfDay.setHours(0, 0, 0, 0);

            const endOfDay = new Date(date);
            endOfDay.setHours(23, 59, 59, 999);

            const pendingPickups = await PickupModel.find({
                kabadiwalaId, // assuming they are pre-assigned or we query an area pool
                status: 'accepted',
                'scheduledWindow.start': { $gte: startOfDay, $lte: endOfDay }
            });

            if (pendingPickups.length === 0) return;

            // Map pickups to structured array format for Gemini to interpret visually/spatially
            // Assuming a base start location
            const startLocation = { lat: 18.5204, lng: 73.8567 };

            const stops = pendingPickups.map(p => ({
                id: (p as any)._id.toString(),
                lat: p.citizenLocation.lat,
                lng: p.citizenLocation.lng,
                window: p.scheduledWindow
            }));

            // Step 2 — Send to Gemini
            // MOCK
            /*
            const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
            const prompt = `Calculate the optimal traveling salesman route for a waste collector given a start location of ${JSON.stringify(startLocation)} and these stops: ${JSON.stringify(stops)}. Consider time constraints. Return as an ordered list of IDs.`;
            const result = await model.generateContent(prompt);
            const orderedIds = JSON.parse(result.response.text());
            */

            // Stubs
            const orderedIds = stops.map(s => s.id);
            const optimizedCount = orderedIds.length;
            const durationHours = (optimizedCount * 25) / 60; // Approx 25 mins per stop

            console.log(`[RouteOptimizer] Optimized ${optimizedCount} stops for kabadiwala ${kabadiwalaId}`);

            // Step 4 — Push to Kabadiwalla
            // await notificationService.routeOptimized(kabadiwalaId, optimizedCount, durationHours);

        } catch (error) {
            console.error("[RouteOptimizer] Error optimizing route:", error);
        }
    }
};
