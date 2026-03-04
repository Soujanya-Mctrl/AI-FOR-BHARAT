import { Router } from 'express';
export const router = Router();

// Routes will be connected here
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import reportRoutes from './report.routes';
import pickupRoutes from './pickup.routes';
import verificationRoutes from './verification.routes';
import pointsRoutes from './points.routes';
import municipalityRoutes from './municipality.routes';
import carbonRoutes from './carbon.routes';
import facilitiesRoutes from './facilities.routes';

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/reports', reportRoutes);
router.use('/pickups', pickupRoutes);
router.use('/verification', verificationRoutes);
router.use('/points', pointsRoutes);
router.use('/municipality', municipalityRoutes);
router.use('/carbon', carbonRoutes);
router.use('/facilities', facilitiesRoutes);

export default router;
