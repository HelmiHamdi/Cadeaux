import express from "express";
import { selectManualWinners, getAllWinners } from "../controllers/winnerController.js";
import { authenticateAdmin } from "../middleware/auth.js";

const router = express.Router();

// Toutes les routes nécessitent une authentification admin
router.use(authenticateAdmin);

// 🏆 Sélectionner manuellement les gagnants
router.post("/select-winners", selectManualWinners);

// 📋 Récupérer tous les gagnants
router.get("/all-winners", getAllWinners);

export default router;