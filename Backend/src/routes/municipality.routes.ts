import { Router } from 'express';
import { exportCompliancePDF, getDashboard } from '../controller/municipality.controller';
import { authenticate } from '../middleware/authenticate';
import { authorize } from '../middleware/authorize';
import { exportLimiter } from '../middleware/rateLimiter';

const router = Router();
router.use(authenticate);
router.use(authorize('municipality', 'admin'));

router.get('/dashboard', getDashboard);
router.get('/compliance/export', exportLimiter, exportCompliancePDF);

export default router;
