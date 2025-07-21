import express from "express";
import { registerUser } from "../controllers/user.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", requireAuth, registerUser);

export default router;