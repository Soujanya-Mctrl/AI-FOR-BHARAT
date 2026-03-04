import { Router } from 'express';
import { exportCSV, getSystemStats, suspendUser } from '../controller/admin.controller';
import { authenticate } from '../middleware/authenticate';
import { authorize } from '../middleware/authorize';
import { exportLimiter } from '../middleware/rateLimiter';

const router = Router();
router.use(authenticate);
router.use(authorize('admin'));

router.get('/stats', getSystemStats);
router.patch('/users/:userId/suspend', suspendUser);
router.get('/export/users', exportLimiter, exportCSV);

export default router;
