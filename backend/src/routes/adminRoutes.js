import express from "express";
import { 
  getAdminDashboard,
  addNewGifts,
  deleteGift,
   updateGift,
  getGiftParticipants,
  triggerManualDraw,
  
} from "../controllers/adminController.js";
import { authenticateAdmin } from "../middleware/auth.js";

const router = express.Router();

// Toutes les routes admin nécessitent une authentification
router.use(authenticateAdmin);

// Tableau de bord
router.get("/dashboard", getAdminDashboard);

// Gestion des cadeaux
router.post("/gifts", addNewGifts);
router.delete("/gifts/:id", deleteGift);
router.put("/gifts/:id", updateGift);
router.get("/gifts/:giftId/participants", getGiftParticipants);

// Tirages
router.post("/draws/manual", triggerManualDraw);

export default router;