import { Router } from 'express';
import { generateReport, getReports } from '../controllers/carbon.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';

const router = Router();

router.use(authenticate);
router.use(authorize('admin', 'municipality'));

router.post('/generate', generateReport);
router.get('/reports', getReports);

export default router;
