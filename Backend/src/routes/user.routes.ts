import { Router } from 'express';
import {
    acceptGCInvite,
    checkGCeligibility,
    getPickupHistory,
    getPoints,
    getProfile,
    getTrustScore,
    updateAddress,
    updateProfile,
    uploadProfilePhoto
} from '../controllers/user.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { uploadImage } from '../middlewares/upload.middleware';

import { loginController, logout, registerController, verifyController } from "../controllers/auth.controller_v2.js";
import authMiddleware from "../middlewares/auth.middleware_v2.js";

const router = Router();

// Auth routes (from second block)
router.post('/register', registerController);
router.post('/login', loginController);
router.post('/logout', logout);
router.get('/verify', authMiddleware, verifyController);

// All other routes require authentication (from first block)
router.use(authenticate);

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.patch('/address', updateAddress);

router.get('/trust-score', getTrustScore);
router.get('/points', getPoints);
router.get('/pickup-history', getPickupHistory);

router.post('/profile-photo', uploadImage.single('photo'), uploadProfilePhoto);

router.get('/green-champion/eligibility', checkGCeligibility);
router.post('/green-champion/accept', acceptGCInvite);

export default router;
