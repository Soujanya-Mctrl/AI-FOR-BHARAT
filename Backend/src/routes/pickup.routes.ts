import { Router } from 'express';
import {
    acceptPickup,
    cancelPickup,
    confirmPickup,
    createPickup,
    declinePickup,
    getCitizenPickupHistory,
    getKabadiwallaPickupHistory,
    getNearbyKabadiwallas,
    getOptimizedRoute,
    getPendingPickupsKabadiwalla,
    getPickup,
    ratePickup
} from '../controllers/pickup.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { uploadImage } from '../middlewares/upload.middleware';

// Older style imports
import {
    acceptPickup as acceptPickup_v2,
    confirmPickup as confirmPickup_v2,
    getNearbyRequests,
    getPickupById,
    getPickupHistory,
    getTodayRoute,
    requestPickup
} from '../controllers/PickupController.js';
import authMiddleware_v2 from '../middlewares/auth.middleware_v2.js';

const router = Router();

// ==========================================
// V2 Auth (Older routes)
// ==========================================
// Citizen routes
router.post('/request', authMiddleware_v2, requestPickup);
router.post('/rate/:id', authMiddleware_v2, (req, res) => {
    res.status(200).json({ success: true, message: 'Rating submitted' });
});

// Kabadiwalla routes
router.patch('/accept/:id', authMiddleware_v2, acceptPickup_v2);
router.post('/confirm/:id', authMiddleware_v2, confirmPickup_v2);
router.get('/nearby', authMiddleware_v2, getNearbyRequests);
router.get('/route/today', authMiddleware_v2, getTodayRoute);

// Shared routes
router.get('/history', authMiddleware_v2, getPickupHistory);


// ==========================================
// V1 Auth (Newer styled routes)
// All these routes require centralized authentication
router.use(authenticate);

// ------------------------------------------------------------------
// Citizen Routes
// ------------------------------------------------------------------
router.post('/', authorize('citizen'), createPickup);
router.get('/nearby-kabadiwallas', authorize('citizen'), getNearbyKabadiwallas);
router.get('/history/citizen', authorize('citizen'), getCitizenPickupHistory);
router.patch('/:id/cancel', authorize('citizen', 'admin'), cancelPickup);
router.post('/:id/rate', authorize('citizen'), ratePickup);

// ------------------------------------------------------------------
// Kabadiwalla Routes
// ------------------------------------------------------------------
router.get('/kabadiwalla/pending', authorize('kabadiwalla'), getPendingPickupsKabadiwalla);
router.get('/history/kabadiwalla', authorize('kabadiwalla'), getKabadiwallaPickupHistory);
router.get('/kabadiwalla/route', authorize('kabadiwalla'), getOptimizedRoute);
router.patch('/:id/accept', authorize('kabadiwalla'), acceptPickup);
router.patch('/:id/decline', authorize('kabadiwalla'), declinePickup);
router.post('/:id/confirm', authorize('kabadiwalla'), uploadImage.single('image'), confirmPickup);

// ------------------------------------------------------------------
// Shared / General Routes
// ------------------------------------------------------------------
router.get('/v1/:id', getPickup);
router.get('/:id', authMiddleware_v2, getPickupById);

export default router;
