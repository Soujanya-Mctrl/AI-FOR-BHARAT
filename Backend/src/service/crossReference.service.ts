// import { PickupRequestModel } from '../models/PickupRequest.model';
// To be implemented in Stage 2
// import { qualityScoreService } from './qualityScore.service.js';
// import { signalCollectorService } from './signalCollector.service.js';

function calculateHaversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371e3; // metres
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) *
        Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // in metres
}

export const crossReferenceService = {
    processPickup: async (pickupId: string) => {
        // Disabled until schema updates are applied
        console.log(`[CrossReference] Mock processed ${pickupId}`);
        return { compositeScore: 100, anomalyFlags: [] };
    }
};
