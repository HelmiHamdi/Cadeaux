import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import "./cron/weeklyDraw.js";
import { connectDB } from "./lib/db.js";

import giftRoutes from "./routes/giftRoutes.js";
import weeklyDrawRoutes from "./routes/weeklyDrawRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import path from "path";

dotenv.config();

const app = express();
const PORT = process.env.PORT;
const __dirname = path.resolve();

app.use(cors());
app.use(express.json());

// API Routes
app.use("/api/gifts", giftRoutes);
app.use("/api/draws", weeklyDrawRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);

// Root route
app.get("/", (req, res) => {
  res.send("🎁 Gift Game API is running!");
});

// Production static file serving - MUST COME LAST
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/build')));
  
  // Catch-all handler for SPA - must be the last route
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});

}

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  connectDB(); 
});