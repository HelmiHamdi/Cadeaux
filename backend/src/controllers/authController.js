import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";

// Générer token JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "admin_secret_fallback", {
    expiresIn: "7d",
  });
};

// 🔐 Login Admin
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        error: "Champs manquants",
        message: "Email et mot de passe requis"
      });
    }

    // Trouver l'admin
    const admin = await Admin.findOne({ email: email.toLowerCase().trim() });
    
    if (!admin) {
      return res.status(401).json({
        error: "Identifiants invalides",
        message: "Email ou mot de passe incorrect"
      });
    }

    // Vérifier le mot de passe
    const isPasswordValid = await admin.comparePassword(password);
    
    if (!isPasswordValid) {
      return res.status(401).json({
        error: "Identifiants invalides", 
        message: "Email ou mot de passe incorrect"
      });
    }

    // Mettre à jour lastLogin
    admin.lastLogin = new Date();
    await admin.save();

    // Générer token
    const token = generateToken(admin._id);

    res.json({
      message: "Connexion réussie",
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      }
    });

  } catch (error) {
    console.error("Erreur login admin:", error);
    res.status(500).json({ 
      error: "Erreur serveur",
      message: "Impossible de se connecter" 
    });
  }
};

// 👤 Get admin profile
export const getAdminProfile = async (req, res) => {
  try {
    res.json(req.admin);
  } catch (error) {
    res.status(500).json({ 
      error: "Erreur serveur",
      message: "Impossible de récupérer le profil" 
    });
  }
};

// ➕ Create first admin (pour initialisation)
export const createFirstAdmin = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Vérifier si admin existe déjà
    const existingAdmin = await Admin.findOne();
    if (existingAdmin) {
      return res.status(400).json({
        error: "Admin existe déjà",
        message: "Un compte admin existe déjà"
      });
    }

    const admin = await Admin.create({
      email: email.toLowerCase().trim(),
      password,
      name
    });

    const token = generateToken(admin._id);

    res.status(201).json({
      message: "Admin créé avec succès",
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      }
    });

  } catch (error) {
    console.error("Erreur création admin:", error);
    res.status(500).json({ 
      error: "Erreur serveur",
      message: "Impossible de créer l'admin" 
    });
  }
};