import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import "./cron/weeklyDraw.js";
import { connectDB } from "./lib/db.js";
import giftRoutes from "./routes/giftRoutes.js";
import weeklyDrawRoutes from "./routes/weeklyDrawRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Pour obtenir __dirname dans ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(cors());
app.use(express.json());

// --- API Routes ---
app.use("/api/gifts", giftRoutes);
app.use("/api/draws", weeklyDrawRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);

// --- Root route ---
app.get("/", (req, res) => {
  res.send("🎁 Gift Game API is running!");
});

// --- Serve frontend React en production ---
if (process.env.NODE_ENV === "production") {
  const buildPath = join(__dirname, "../frontend/build");
  app.use(express.static(buildPath));

  // ✅ Compatible Express 5
  app.use((req, res) => {
    res.sendFile(join(buildPath, "index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  connectDB();
});
