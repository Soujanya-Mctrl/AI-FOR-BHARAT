import express from "express";
import multer from "multer";
import { createTypeController, getAllReports, updateReportStatus } from "../controller/WasteType.Controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();

router.post('/image',
    authMiddleware,
    upload.single('image'),
    createTypeController
);

router.get('/list',
    authMiddleware,
    getAllReports
);

router.patch('/:id/status',
    authMiddleware,
    updateReportStatus
);

export default router;
