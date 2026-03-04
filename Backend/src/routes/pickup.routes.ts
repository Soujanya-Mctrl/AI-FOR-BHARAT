import express from 'express';
import {
    acceptPickup,
    confirmPickup,
    getNearbyRequests,
    getPickupById,
    getPickupHistory,
    getTodayRoute,
    requestPickup
} from '../controller/PickupController.js';
import authMiddleware from '../middleware/auth.middleware.js';

const router = express.Router();

// All pickup routes require authentication
router.use(authMiddleware);

// Citizen routes
router.post('/request', requestPickup);
router.post('/rate/:id', (req, res) => {
    // Placeholder for citizen rating logic if separate from confirm
    res.status(200).json({ success: true, message: 'Rating submitted' });
});

// Kabadiwalla routes
router.patch('/accept/:id', acceptPickup);
router.post('/confirm/:id', confirmPickup);
router.get('/nearby', getNearbyRequests);
router.get('/route/today', getTodayRoute);

// Shared routes
router.get('/history', getPickupHistory);
router.get('/:id', getPickupById);

export default router;
