import express from "express";
import { getLeaderboard, getUserDashboard } from "../controller/rewards.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/leaderboard", authMiddleware, getLeaderboard);
router.get("/user", authMiddleware, getUserDashboard);

export default router;
