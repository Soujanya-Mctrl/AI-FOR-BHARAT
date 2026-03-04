import { Router } from 'express';
import { getDashboardStats } from '../controllers/municipality.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';

const router = Router();

router.use(authenticate);
router.use(authorize('municipality', 'admin'));

router.get('/dashboard/:wardId', getDashboardStats);

export default router;
