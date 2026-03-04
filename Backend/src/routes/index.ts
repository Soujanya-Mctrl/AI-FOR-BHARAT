// Master router — mounts all route groups under /api/v1
import { Router } from 'express';

import adminRoutes from './admin.routes';
import kabadiwallaRoutes from './kabadiwalla.routes';
import municipalityRoutes from './municipality.routes';
import notificationRoutes from './notification.routes';
import pickupRoutes from './pickup.routes';
import reportRoutes from './report.routes';
import trustRoutes from './trust.routes';
import userRoutes from './user.routes';
import verificationRoutes from './verification.routes';

const router = Router();

router.use('/users', userRoutes);
router.use('/reports', reportRoutes);
router.use('/pickups', pickupRoutes);
router.use('/verification', verificationRoutes);
router.use('/trust', trustRoutes);
router.use('/kabadiwalla', kabadiwallaRoutes);
router.use('/municipality', municipalityRoutes);
router.use('/notifications', notificationRoutes);
router.use('/admin', adminRoutes);

export default router;
