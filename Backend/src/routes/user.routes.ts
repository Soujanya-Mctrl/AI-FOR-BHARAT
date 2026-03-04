import express from "express";
import { loginController, logout, registerController, verifyController } from "../controller/auth.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

router.post('/register', registerController);
router.post('/login', loginController);
router.post('/logout', logout);
router.get('/verify', authMiddleware, verifyController);

export default router;
