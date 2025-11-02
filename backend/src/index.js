import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import "./cron/weeklyDraw.js";
import { connectDB } from "./lib/db.js";
import giftRoutes from "./routes/giftRoutes.js";
import weeklyDrawRoutes from "./routes/weeklyDrawRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;


const __dirname = path.resolve();

app.use(cors());
app.use(express.json());

// --- Routes API ---
app.use("/api/gifts", giftRoutes);
app.use("/api/draws", weeklyDrawRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);

// --- Servir React en production ---
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("/{*any}", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}






// --- Route racine test API ---
app.get("/api", (req, res) => {
  res.send("🎁 Gift Game API is running!");
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  connectDB();
});
