import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

import "./cron/weeklyDraw.js";
import { connectDB } from "./lib/db.js";
import giftRoutes from "./routes/giftRoutes.js";
import weeklyDrawRoutes from "./routes/weeklyDrawRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import codeRoutes from "./routes/codeRoutes.js";
import winnerRoutes from "./routes/winnerRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Obtenir le bon __dirname avec ES Modules
const __dirname = path.resolve();

// ✅ CORS global
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));

app.use(express.json());

// --- Routes API ---
app.use("/api/gifts", giftRoutes);
app.use("/api/draws", weeklyDrawRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/codes", codeRoutes);
app.use("/api/winners", winnerRoutes);

// --- Route test API ---
app.get("/api", (req, res) => {
  res.send("🎁 Gift Game API is running!");
});

// --- Servir le frontend en production ---
if (process.env.NODE_ENV === "production") {
  const frontendPath = path.join(__dirname, "../frontend/dist");

  // 🟢 1. Servir les fichiers statiques
  app.use(express.static(frontendPath));

  // 🟢 2. Rediriger TOUTES les autres routes vers index.html
  app.get("*", (req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
  });
}

// --- Démarrer le serveur ---
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  connectDB();
});
