import { GoogleGenerativeAI } from '@google/generative-ai';
import { PickupRequestModel } from '../models/PickupRequest.model';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export const routeOptimizerAgent = {
    optimizeRoute: async (kabadiwalaId: string, date: Date) => {
        try {
            // Step 1 — Gather inputs
            const startOfDay = new Date(date);
            startOfDay.setHours(0, 0, 0, 0);

            const endOfDay = new Date(date);
            endOfDay.setHours(23, 59, 59, 999);

            const pendingPickups = await PickupRequestModel.find({
                kabadiwallaId: kabadiwalaId,
                status: 'accepted'
            });

            if (pendingPickups.length === 0) return;

            // Map pickups to structured array format for Gemini
            const startLocation = { lat: 18.5204, lng: 73.8567 };

            const stops = pendingPickups.map(p => ({
                id: (p as any)._id.toString(),
                lat: p.address.coordinates.lat,
                lng: p.address.coordinates.lng,
                window: p.scheduledTime
            }));

            // Step 2 — Send to Gemini (mocked)
            /*
            const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
            const prompt = `Calculate the optimal traveling salesman route...`;
            const result = await model.generateContent(prompt);
            const orderedIds = JSON.parse(result.response.text());
            */

            // Stubs
            const orderedIds = stops.map(s => s.id);
            const optimizedCount = orderedIds.length;
            const durationHours = (optimizedCount * 25) / 60;

            console.log(`[RouteOptimizer] Optimized ${optimizedCount} stops for kabadiwala ${kabadiwalaId}`);

        } catch (error) {
            console.error("[RouteOptimizer] Error optimizing route:", error);
        }
    }
};
