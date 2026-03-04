import { Router } from 'express';
import { getPickupHistory, getProfile, updateProfile } from '../controller/user.controller';
import { authenticate } from '../middleware/authenticate';

const router = Router();
router.use(authenticate);

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.get('/pickup-history', getPickupHistory);

export default router;
