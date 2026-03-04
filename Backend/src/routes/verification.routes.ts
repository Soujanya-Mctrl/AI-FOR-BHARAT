import { Router } from 'express';
import {
    triggerCrossReference,
    getQualityScore,
    getAnomalies,
    submitManualReview
} from '../controllers/verification.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';

const router = Router();

router.use(authenticate);

// Automated systems or Admins triggers this
router.post('/cross-reference', authorize('admin'), triggerCrossReference);

// Anyone involved in pickup can potentially see the score (or restrict per spec)
router.get('/quality-score/:pickupId', getQualityScore);

router.get('/anomalies', authorize('admin', 'municipality'), getAnomalies);
router.post('/manual-review', authorize('admin', 'green_champion'), submitManualReview);

export default router;
