import express from "express";
import { 
  loginAdmin, 
  getAdminProfile, 
  createFirstAdmin 
} from "../controllers/authController.js";
import { authenticateAdmin } from "../middleware/auth.js";

const router = express.Router();

// Public routes
router.post("/login", loginAdmin);
router.post("/init", createFirstAdmin); // Route pour créer le premier admin

// Protected routes
router.get("/profile", authenticateAdmin, getAdminProfile);

export default router;