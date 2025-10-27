import express from "express";
import {
  signupSuperAdmin,
  loginSuperAdmin,
  getSuperAdminProfile,
} from "../controllers/superAdminController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Auth Routes
router.post("/signup", signupSuperAdmin);
router.post("/login", loginSuperAdmin);

// Protected Route
router.get("/me", protect, getSuperAdminProfile);

export default router;
