import { Router } from 'express';
import { adjustTrustScore, getTrustScore } from '../controller/trust.controller';
import { authenticate } from '../middleware/authenticate';
import { authorize } from '../middleware/authorize';

const router = Router();
router.use(authenticate);

router.get('/:id', getTrustScore);
router.patch('/:id', authorize('admin'), adjustTrustScore);

export default router;
