import { Router } from 'express';
import { sendNotification } from '../controller/notification.controller';
import { authenticate } from '../middleware/authenticate';
import { authorize } from '../middleware/authorize';

const router = Router();
router.use(authenticate);

router.post('/send', authorize('admin'), sendNotification);

export default router;
