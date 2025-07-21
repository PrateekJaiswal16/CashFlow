// routes/receiptRoutes.js
import express from 'express';
import multer from 'multer'; 
import { requireAuth } from '../middleware/auth.middleware.js';
import { scanReceipt } from '../controllers/receipt.controller.js';

const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

router.post('/scan', requireAuth, upload.single('receipt'), scanReceipt);

export default router;