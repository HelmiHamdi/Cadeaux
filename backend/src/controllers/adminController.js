import Gift from "../models/Gift.js";
import Participant from "../models/Participant.js";
import WeeklyDraw from "../models/WeeklyDraw.js";

import { archiveGifts } from "./giftController.js";

// 📊 Tableau de bord admin
export const getAdminDashboard = async (req, res) => {
  try {
    const totalGifts = await Gift.countDocuments();
    const totalParticipants = await Participant.countDocuments();
    const totalDraws = await WeeklyDraw.countDocuments({ isDrawn: true });
    const activeGifts = await Gift.find().limit(5);

    // Participants récents (7 derniers jours)
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const recentParticipants = await Participant.find({
      createdAt: { $gte: oneWeekAgo }
    })
    .sort({ createdAt: -1 })
    .limit(10)
    .populate('giftId');

    // Statistiques hebdomadaires
    const weeklyStats = await Participant.aggregate([
      {
        $match: {
          createdAt: { $gte: oneWeekAgo }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({
      stats: {
        totalGifts,
        totalParticipants,
        totalDraws,
        activeGifts: activeGifts.length,
        weeklyParticipants: weeklyStats.reduce((sum, day) => sum + day.count, 0)
      },
      activeGifts,
      recentParticipants,
      weeklyStats
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ➕ Ajouter de nouveaux cadeaux
export const addNewGifts = async (req, res) => {
  try {
    const { gifts } = req.body;
    
    if (!gifts || !Array.isArray(gifts) || gifts.length === 0) {
      return res.status(400).json({ 
        error: "Données invalides",
        message: "Liste de cadeaux vide ou invalide" 
      });
    }

    // Valider chaque cadeau
    for (const gift of gifts) {
      if (!gift.title || !gift.title.trim()) {
        return res.status(400).json({
          error: "Données invalides",
          message: "Le titre est requis pour tous les cadeaux"
        });
      }
    }

    // Archiver les anciens cadeaux et ajouter les nouveaux
    const archiveResult = await archiveGifts({ 
      giftIds: null,
      newGifts: gifts 
    });

    res.json({
      message: `${gifts.length} nouveaux cadeaux ajoutés avec succès`,
      archived: archiveResult.archived,
      newGifts: archiveResult.inserted
    });
  } catch (err) {
    res.status(500).json({ 
      error: "Erreur serveur",
      message: err.message 
    });
  }
};

// ✏️ MODIFIER un cadeau (NOUVEAU)
export const updateGift = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, image } = req.body;

    // Validation des données
    if (!title || !title.trim()) {
      return res.status(400).json({
        error: "Données invalides",
        message: "Le titre est requis"
      });
    }

    // Vérifier si le cadeau existe
    const existingGift = await Gift.findById(id);
    if (!existingGift) {
      return res.status(404).json({
        error: "Cadeau non trouvé",
        message: "Le cadeau spécifié n'existe pas"
      });
    }

    // Mettre à jour le cadeau
    const updatedGift = await Gift.findByIdAndUpdate(
      id,
      {
        title: title.trim(),
        description: description?.trim() || "",
        image: image?.trim() || ""
      },
      { 
        new: true, // Retourner le document mis à jour
        runValidators: true 
      }
    );

    res.json({
      message: "Cadeau modifié avec succès",
      gift: updatedGift
    });

  } catch (err) {
    console.error("❌ Erreur modification cadeau:", err);
    res.status(500).json({ 
      error: "Erreur serveur",
      message: err.message 
    });
  }
};

// 🗑️ Supprimer un cadeau
export const deleteGift = async (req, res) => {
  try {
    const { id } = req.params;
    
    const gift = await Gift.findByIdAndDelete(id);
    if (!gift) {
      return res.status(404).json({
        error: "Cadeau non trouvé",
        message: "Le cadeau spécifié n'existe pas"
      });
    }

    await Participant.deleteMany({ giftId: id });
    
    res.json({ 
      message: "Cadeau supprimé avec succès",
      deletedGift: gift.title 
    });
  } catch (err) {
    res.status(500).json({ 
      error: "Erreur serveur",
      message: err.message 
    });
  }
};

// 👥 Voir les participants d'un cadeau
export const getGiftParticipants = async (req, res) => {
  try {
    const { giftId } = req.params;
    
    const gift = await Gift.findById(giftId);
    if (!gift) {
      return res.status(404).json({
        error: "Cadeau non trouvé",
        message: "Le cadeau spécifié n'existe pas"
      });
    }

    const participants = await Participant.find({ giftId })
      .sort({ createdAt: -1 });
    
    res.json({
      gift: {
        id: gift._id,
        title: gift.title,
        description: gift.description
      },
      participants,
      count: participants.length
    });
  } catch (err) {
    res.status(500).json({ 
      error: "Erreur serveur",
      message: err.message 
    });
  }
};

// 🎯 Déclencher manuellement un tirage
export const triggerManualDraw = async (req, res) => {
  try {
    const gifts = await Gift.find();
    const currentDate = new Date();
    const results = [];
    
    for (const gift of gifts) {
      const participants = await Participant.find({ giftId: gift._id });
      
      if (participants.length > 0) {
        const winner = participants[Math.floor(Math.random() * participants.length)];
        
        const weeklyDraw = await WeeklyDraw.create({
          week: currentDate.getWeek(),
          year: currentDate.getFullYear(),
          giftId: gift._id,
          winnerCode: winner.code,
          winnerEmail: winner.email,
          winnerName: `${winner.name} ${winner.surname}`,
          giftTitle: gift.title,
          isDrawn: true,
          drawDate: currentDate
        });

        results.push({
          gift: gift.title,
          winner: `${winner.name} ${winner.surname}`,
          email: winner.email,
          code: winner.code
        });
        
        console.log(`🏆 Gagnant pour ${gift.title}: ${winner.email}`);
      } else {
        results.push({
          gift: gift.title,
          winner: "Aucun participant",
          email: null,
          code: null
        });
      }
    }
    
    res.json({ 
      message: "Tirage manuel effectué avec succès",
      results 
    });
  } catch (err) {
    res.status(500).json({ 
      error: "Erreur serveur",
      message: err.message 
    });
  }
};
 /******* */
 