import { Router } from 'express';
import { getBalance, getPointsHistory, redeemPoints } from '../controllers/points.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/balance', getBalance);
router.get('/history', getPointsHistory);
router.post('/redeem', redeemPoints);

export default router;
