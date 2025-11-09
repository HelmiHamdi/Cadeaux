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
const __dirname = path.resolve();

// Middleware de logging pour déboguer
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  next();
});

app.use(cors({
  origin: "*",
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(express.json());

// --- Routes API ---
app.use("/api/gifts", giftRoutes);
app.use("/api/draws", weeklyDrawRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/codes", codeRoutes);
app.use("/api/winners", winnerRoutes);

// --- Route racine test API ---
app.get("/api", (req, res) => {
  res.json({ 
    message: "🎁 Gift Game API is running!",
    timestamp: new Date().toISOString()
  });
});

// --- Servir React en production ---
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  // Capture seulement les routes qui ne commencent pas par /api
  app.get(/^\/(?!api).*/, (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist", "index.html"));
  });
}

// --- Middleware pour les routes API non trouvées ---
app.use("/api/*", (req, res) => {
  res.status(404).json({ 
    error: "Route API non trouvée",
    path: req.originalUrl
  });
});

// --- Middleware de gestion d'erreurs ---
app.use((err, req, res, next) => {
  console.error("Erreur serveur:", err);
  res.status(500).json({ 
    error: "Erreur interne du serveur",
    message: process.env.NODE_ENV === "development" ? err.message : "Quelque chose s'est mal passé"
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
  connectDB();
});