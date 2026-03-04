import PickupModel from '../models/Pickup.model.js';
import { notificationService } from './notification.service.js';
import { paymentService } from './payment.service.js';
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
        const pickup = await PickupModel.findById(pickupId);
        if (!pickup) throw new Error("Pickup not found");

        if (!pickup.kabadiwalaArrival || !pickup.scheduledWindow) {
            throw new Error("Missing required arrival or schedule data");
        }

        let compositeScore = 0;
        const anomalyFlags: string[] = [];

        // Signal 1 — GPS Match
        const distanceMeters = calculateHaversineDistance(
            pickup.citizenLocation.lat,
            pickup.citizenLocation.lng,
            pickup.kabadiwalaArrival.lat,
            pickup.kabadiwalaArrival.lng
        );

        if (distanceMeters <= 50) {
            compositeScore += 25;
        } else {
            anomalyFlags.push('gps_mismatch');
        }

        // Signal 2 — Dwell Time
        if (pickup.kabadiwalaArrival.dwellTimeMinutes >= 3) {
            compositeScore += 25;
        } else {
            anomalyFlags.push('insufficient_dwell');
        }

        // Signal 3 — Time Gap Plausibility
        // Gap between scheduledWindow.end and kabadiwala confirmedAt(using arrivedAt for now)
        const gapMinutes = (pickup.kabadiwalaArrival.arrivedAt.getTime() - pickup.scheduledWindow.end.getTime()) / (1000 * 60);

        // We only penalise if they are LATE by more than 120 minutes
        if (gapMinutes <= 120) {
            compositeScore += 25;
        } else {
            anomalyFlags.push('time_window_exceeded');
        }

        // Signal 4 — Rating Correlation
        // To be implemented accurately when historical data is attached
        // For now we assume a passing score if no massive divergence
        compositeScore += 25;

        // Save initial score
        pickup.crossReferenceResult = {
            compositeScore,
            anomalyFlags,
            processedAt: new Date()
        };
        await pickup.save();

        console.log(`[CrossReference] Composite Score: ${compositeScore}, Flags: ${anomalyFlags}`);

        // Action matrix
        if (compositeScore >= 70) {
            const paymentResult = await paymentService.releasePayment(pickupId, compositeScore);
            if (pickup.kabadiwalaId) {
                await notificationService.paymentReleased(pickup.kabadiwalaId.toString(), paymentResult.kabadiwalaAmount);
            }
            // TODO: await qualityScoreService.updateBoth(...)
        } else if (compositeScore < 50) {
            pickup.paymentStatus = 'withheld';
            await pickup.save();
            // TODO: await signalCollectorService.queueForInvestigation(...)
            await notificationService.adminAlert([], 'low_trust_score', pickup.citizenId.toString());
        } else { // 50-69
            pickup.paymentStatus = 'partial';
            // Release 80% payment
            // We'll mimic this by passing the lower score to payment service
            await paymentService.releasePayment(pickupId, compositeScore);
            await pickup.save();
        }

        // Always update scores
        // TODO: await qualityScoreService.updateBoth(...)

        return { compositeScore, anomalyFlags };
    }
};
