import { IPickupRequestDocument, PickupRequestModel } from '../models/PickupRequest.model';
import { ApiError } from '../utils/ApiError';

export class PickupService {
    static async createPickup(citizenId: string, data: Record<string, any>): Promise<IPickupRequestDocument> {
        if (!data.address || !data.scheduledTime) {
            throw new ApiError(400, 'Address and scheduled time are required.');
        }

        const pickup = await PickupRequestModel.create({
            citizenId,
            ...data
        });

        return pickup;
    }

    static async acceptPickup(pickupId: string, kabadiwallaId: string): Promise<IPickupRequestDocument> {
        const pickup = await PickupRequestModel.findOne({ _id: pickupId, status: 'pending' });
        if (!pickup) {
            throw new ApiError(404, 'Pickup request not found or not pending.');
        }

        pickup.kabadiwallaId = kabadiwallaId as any;
        pickup.status = 'accepted';
        await pickup.save();

        return pickup;
    }

    static async declinePickup(pickupId: string, kabadiwallaId: string): Promise<IPickupRequestDocument> {
        const pickup = await PickupRequestModel.findOne({ _id: pickupId, kabadiwallaId, status: 'accepted' });
        if (!pickup) {
            throw new ApiError(404, 'Pickup request not found or not accepted by you.');
        }

        pickup.status = 'pending';
        pickup.kabadiwallaId = undefined; // Return to pool
        await pickup.save();

        return pickup;
    }

    static async confirmPickup(pickupId: string, kabadiwallaId: string): Promise<IPickupRequestDocument> {
        const pickup = await PickupRequestModel.findOne({ _id: pickupId, kabadiwallaId, status: 'accepted' });
        if (!pickup) {
            throw new ApiError(404, 'Pickup request not found or not accepted by you.');
        }

        pickup.status = 'completed';
        await pickup.save();
        return pickup;
    }

    static async getPendingPickupsNearby(locationFilters: any): Promise<IPickupRequestDocument[]> {
        // This would ideally incorporate geospatial $near queries using the locationFilters
        return PickupRequestModel.find({ status: 'pending' }).sort({ scheduledTime: 1 });
    }
}
