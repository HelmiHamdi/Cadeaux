import express from "express";
import { getWeeklyWinners } from "../controllers/weeklyDrawController.js";

const router = express.Router();

// 📅 Récupérer les gagnants existants
router.get("/winners", getWeeklyWinners);



export default router;
