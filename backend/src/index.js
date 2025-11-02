import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Configuration CORS COMPLÈTE
const corsOptions = {
  origin: function (origin, callback) {
    // Autoriser toutes les origines en production, ou spécifiques en développement
    const allowedOrigins = [
      'https://cadeaurama.onrender.com',
      'http://localhost:3000',
      'http://localhost:5173',
      'https://cadeaurama-frontend.onrender.com' // si vous avez un frontend séparé
    ];
    
    // En production, autoriser toutes les origines pour mobile
    if (process.env.NODE_ENV === 'production') {
      callback(null, true);
    } else {
      // En développement, vérifier l'origine
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
};

app.use(cors(corsOptions));

// Gérer les preflight requests
app.options('*', cors(corsOptions));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// --- Routes API ---
app.use("/api/gifts", giftRoutes);
app.use("/api/draws", weeklyDrawRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);

// --- Route santé pour tester ---
app.get("/api/health", (req, res) => {
  res.json({ 
    status: "OK",
    message: "API is running correctly",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

// --- Servir React en production ---
if (process.env.NODE_ENV === "production") {
  const frontendPath = path.join(__dirname, "../frontend/dist");
  
  app.use(express.static(frontendPath));
  
  app.get("*", (req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 Mobile-friendly server started`);
  connectDB();
});