import { Router } from 'express';
import { triggerVerification } from '../controller/verification.controller';
import { authenticate } from '../middleware/authenticate';

const router = Router();
router.use(authenticate);

router.post('/trigger/:reportId', triggerVerification);

export default router;
