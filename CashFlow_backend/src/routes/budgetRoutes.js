import express from "express";
import { requireAuth } from "../middleware/auth.middleware.js";
import {
  setBudget,
  getBudget,
} from "../controllers/budget.controller.js";

const router = express.Router();

router.post("/", requireAuth, setBudget);
router.get("/", requireAuth, getBudget);


export default router;
