import { Router } from 'express';
import {
    acceptPickup,
    cancelPickup,
    confirmPickup,
    createPickup,
    declinePickup,
    getCitizenPickupHistory, getKabadiwallaPickupHistory,
    getNearbyKabadiwallas,
    getOptimizedRoute,
    getPendingPickups,
    getPickup,
    ratePickup
} from '../controller/pickup.controller';
import { authenticate } from '../middleware/authenticate';
import { authorize } from '../middleware/authorize';
import { processImageUpload, uploadImageMiddleware } from '../middleware/uploadImage';

const router = Router();
router.use(authenticate);

// Citizen
router.post('/', authorize('citizen'), createPickup);
router.get('/nearby-kabadiwallas', authorize('citizen'), getNearbyKabadiwallas);
router.get('/history/citizen', authorize('citizen'), getCitizenPickupHistory);
router.patch('/:id/cancel', authorize('citizen', 'admin'), cancelPickup);
router.post('/:id/rate', authorize('citizen'), ratePickup);

// Kabadiwalla
router.get('/kabadiwalla/pending', authorize('kabadiwalla'), getPendingPickups);
router.get('/history/kabadiwalla', authorize('kabadiwalla'), getKabadiwallaPickupHistory);
router.get('/kabadiwalla/route', authorize('kabadiwalla'), getOptimizedRoute);
router.patch('/:id/accept', authorize('kabadiwalla'), acceptPickup);
router.patch('/:id/decline', authorize('kabadiwalla'), declinePickup);
router.post('/:id/confirm', authorize('kabadiwalla'), uploadImageMiddleware, processImageUpload, confirmPickup);

// Shared
router.get('/:id', getPickup);

export default router;
