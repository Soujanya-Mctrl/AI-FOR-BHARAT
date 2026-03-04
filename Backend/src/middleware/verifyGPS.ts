import { NextFunction, Request, Response } from 'express';
import { PickupRequestModel } from '../models/PickupRequest.model';
import { ApiError } from '../utils/ApiError';
import { calculateDistance, isValidCoordinate } from '../utils/geoUtils';

export const verifyGPS = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { lat, lng } = req.body;

        if (lat === undefined || lng === undefined) {
            // For some endpoints tracking GPS coords might be in a different body structure,
            // adapting specifically to confirmation routes for proximity check:
            return next();
        }

        if (!isValidCoordinate(Number(lat), Number(lng))) {
            return next(new ApiError(400, 'Invalid GPS coordinates provided.', [
                { field: 'lat', message: 'Latitude must be between -90 and 90' },
                { field: 'lng', message: 'Longitude must be between -180 and 180' }
            ]));
        }

        // If this is a pickup confirmation route, verify 200m proximity
        const isConfirmRoute = req.originalUrl.includes('/confirm') || req.path.includes('/confirm');
        const pickupId = req.params.id;

        if (isConfirmRoute && pickupId) {
            const pickup = await PickupRequestModel.findById(pickupId);
            if (!pickup) {
                return next(new ApiError(404, 'Pickup request not found.'));
            }

            const targetLat = pickup.address.coordinates.lat;
            const targetLng = pickup.address.coordinates.lng;

            const distanceMeters = calculateDistance(Number(lat), Number(lng), targetLat, targetLng);

            if (distanceMeters > 200) {
                return next(new ApiError(400, 'GPS verification failed. You must be within 200 meters of the pickup location to confirm.', [
                    { field: 'distance', message: `Actual distance: ${distanceMeters.toFixed(2)}m` }
                ]));
            }
        }

        next();
    } catch (error) {
        next(error);
    }
};
