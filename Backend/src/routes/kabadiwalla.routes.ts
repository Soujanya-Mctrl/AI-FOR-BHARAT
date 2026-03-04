import { Router } from 'express';
import { getEarnings, getServiceAreas, verifyDocuments } from '../controller/kabadiwalla.controller';
import { authenticate } from '../middleware/authenticate';
import { authorize } from '../middleware/authorize';

const router = Router();
router.use(authenticate);
router.use(authorize('kabadiwalla'));

router.get('/earnings', getEarnings);
router.get('/service-areas', getServiceAreas);
router.post('/verify-documents', verifyDocuments);

export default router;
