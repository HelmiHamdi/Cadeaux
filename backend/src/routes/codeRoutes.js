import express from "express";
import { 
  getGiftCodes, 
  searchParticipantByCode,
  searchParticipantsByCodes
} from "../controllers/codeController.js";
import { authenticateAdmin } from "../middleware/auth.js";

const router = express.Router();

// Toutes les routes nécessitent une authentification admin
router.use(authenticateAdmin);

// 📋 Récupérer tous les codes d'un cadeau
router.get("/gift/:giftId", getGiftCodes);

// 🔍 Rechercher un participant par code
router.get("/search/:code", searchParticipantByCode);

// 🔍 Rechercher plusieurs participants par codes
router.post("/search-multiple", searchParticipantsByCodes);

export default router;