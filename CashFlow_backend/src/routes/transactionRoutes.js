import express from "express";
import { requireAuth } from "../middleware/auth.middleware.js";
import { cacheMiddleware } from '../middleware/cache.middleware.js';
import {
  createTransaction,
  getTransactions,
  updateTransaction,
  deleteTransaction,
  getTransactionSummary
} from "../controllers/transaction.controller.js";

const router = express.Router();

router.post("/", requireAuth, createTransaction);
router.get("/", requireAuth, cacheMiddleware ,getTransactions);
router.put("/:id", requireAuth, updateTransaction);
router.delete("/:id", requireAuth, deleteTransaction);
router.get("/summary", requireAuth, cacheMiddleware  ,getTransactionSummary);

export default router;
