import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";

export const authenticateAdmin = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    
    if (!token) {
      return res.status(401).json({ 
        error: "Accès refusé", 
        message: "Token manquant" 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "admin_secret_fallback");
    const admin = await Admin.findById(decoded.id).select("-password");
    
    if (!admin) {
      return res.status(401).json({ 
        error: "Accès refusé", 
        message: "Admin non trouvé" 
      });
    }

    req.admin = admin;
    next();
  } catch (error) {
    res.status(401).json({ 
      error: "Token invalide", 
      message: "Session expirée ou invalide" 
    });
  }
};