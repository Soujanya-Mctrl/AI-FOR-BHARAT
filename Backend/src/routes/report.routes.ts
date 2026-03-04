import { Router } from 'express';
import { createReport, getMyReports, getReport, getReportsByArea, getReportsByStatus, updateReportStatus } from '../controller/report.controller';
import { authenticate } from '../middleware/authenticate';
import { authorize } from '../middleware/authorize';
import { processImageUpload, uploadImageMiddleware } from '../middleware/uploadImage';

const router = Router();
router.use(authenticate);

router.post('/', uploadImageMiddleware, processImageUpload, createReport);
router.get('/', getMyReports);
router.get('/filter/status', getReportsByStatus);
router.get('/area/:pincode', getReportsByArea);
router.get('/:id', getReport);
router.patch('/:id/status', authorize('admin', 'municipality'), updateReportStatus);

export default router;
