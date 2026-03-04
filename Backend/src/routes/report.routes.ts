import { Router } from 'express';
import multer from 'multer';
import {
    createReport,
    getMyReports,
    getReport,
    getReportVerification,
    getReportsByArea,
    getReportsByStatus
} from '../controllers/report.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { uploadImage } from '../middlewares/upload.middleware';

// Older style imports
import { createTypeController, getAllReports, updateReportStatus } from "../controllers/WasteType.Controller.js";
import authMiddleware_v2 from "../middlewares/auth.middleware_v2.js";

const upload = multer({ storage: multer.memoryStorage() });

const router = Router();

// ==========================================
// V2 Routes
// ==========================================
router.post('/image',
    authMiddleware_v2,
    upload.single('image'),
    createTypeController
);

router.get('/list',
    authMiddleware_v2,
    getAllReports
);

router.patch('/:id/status',
    authMiddleware_v2,
    updateReportStatus
);

// ==========================================
// V1 Routes
// ==========================================
// All these routes require authentication
router.use(authenticate);

router.post('/', uploadImage.single('image'), createReport);
router.get('/', getMyReports);

// Note: Ensure specific routes (like /filter/status) are placed BEFORE dynamic param routes (like /:id)
router.get('/filter/status', getReportsByStatus);
router.get('/area/:pincode', getReportsByArea);

router.get('/v1/:id', getReport);
router.get('/:id/verification', getReportVerification);

export default router;
