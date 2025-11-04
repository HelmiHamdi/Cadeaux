import Participant from "../models/Participant.js";
import Gift from "../models/Gift.js";
import WeeklyDraw from "../models/WeeklyDraw.js";

// 🏆 Sélectionner manuellement les gagnants
// 🏆 Sélectionner manuellement les gagnants - VERSION AVEC UN SEUL PAR CADEAU
export const selectManualWinners = async (req, res) => {
  try {
    const { winners } = req.body;

    if (!winners || !Array.isArray(winners) || winners.length === 0) {
      return res.status(400).json({
        error: "Données invalides",
        message: "Liste des gagnants requise"
      });
    }

    const currentDate = new Date();
    const currentWeek = currentDate.getWeek();
    const currentYear = currentDate.getFullYear();

    const results = [];

    // Vérifier qu'il n'y a pas de doublons de cadeaux
    const giftIds = winners.map(w => w.giftId);
    const uniqueGiftIds = [...new Set(giftIds)];
    
    if (giftIds.length !== uniqueGiftIds.length) {
      return res.status(400).json({
        error: "Doublons détectés",
        message: "Un cadeau ne peut avoir qu'un seul gagnant"
      });
    }

    for (const winnerData of winners) {
      const { giftId, code } = winnerData;

      // Vérifier si le cadeau existe
      const gift = await Gift.findById(giftId);
      if (!gift) {
        return res.status(404).json({
          error: "Cadeau non trouvé",
          message: `Le cadeau avec l'ID ${giftId} n'existe pas`
        });
      }

      // Vérifier si le code existe pour ce cadeau
      const participant = await Participant.findOne({ 
        giftId, 
        code 
      });

      if (!participant) {
        return res.status(404).json({
          error: "Code non trouvé",
          message: `Le code ${code} n'existe pas pour le cadeau ${gift.title}`
        });
      }

      // Vérifier si un tirage existe déjà pour cette semaine et ce cadeau
      let weeklyDraw = await WeeklyDraw.findOne({
        giftId: giftId,
        week: currentWeek,
        year: currentYear
      });

      if (weeklyDraw) {
        // Mettre à jour le tirage existant
        weeklyDraw.winnerCode = code;
        weeklyDraw.winnerEmail = participant.email;
        weeklyDraw.winnerName = `${participant.name} ${participant.surname}`;
        weeklyDraw.isDrawn = true;
        weeklyDraw.drawDate = currentDate;
        await weeklyDraw.save();
      } else {
        // Créer un nouveau tirage
        weeklyDraw = await WeeklyDraw.create({
          week: currentWeek,
          year: currentYear,
          giftId: giftId,
          winnerCode: code,
          winnerEmail: participant.email,
          winnerName: `${participant.name} ${participant.surname}`,
          giftTitle: gift.title,
          isDrawn: true,
          drawDate: currentDate
        });
      }

      results.push({
        giftId: gift._id,
        giftTitle: gift.title,
        winnerName: `${participant.name} ${participant.surname}`,
        winnerCode: code,
        winnerEmail: participant.email,
        isDrawn: true
      });

      console.log(`🏆 Gagnant sélectionné pour ${gift.title}: ${participant.name} ${participant.surname} (Code: ${code})`);
    }

    res.json({
      message: `${winners.length} gagnants sélectionnés avec succès`,
      results
    });

  } catch (err) {
    console.error("❌ Erreur sélection manuelle:", err);
    res.status(500).json({
      error: "Erreur serveur",
      message: err.message
    });
  }
};
// 📋 Récupérer tous les gagnants (pour affichage) - UN SEUL PAR CADEAU
// Dans winnerController.js - CORRECTION DE getAllWinners
export const getAllWinners = async (req, res) => {
  try {
    console.log("🎯 Récupération de tous les gagnants...");
    
    // Récupérer TOUS les cadeaux actifs
    const activeGifts = await Gift.find();
    console.log(`🎁 ${activeGifts.length} cadeaux actifs trouvés`);

    // Récupérer les gagnants (un par cadeau)
    const winners = await WeeklyDraw.find({ isDrawn: true })
      .sort({ drawDate: -1 })
      .populate('giftId');

    console.log(`📊 ${winners.length} gagnants trouvés dans la base`);

    // Créer un Map pour avoir un gagnant par cadeau (le plus récent)
    const winnersByGift = new Map();
    winners.forEach(draw => {
      const giftId = draw.giftId?._id?.toString() || draw.giftId?.toString();
      if (giftId && !winnersByGift.has(giftId)) {
        winnersByGift.set(giftId, draw);
      }
    });

    // Construire le résultat final : un élément par cadeau actif
    const results = activeGifts.map(gift => {
      const winnerDraw = winnersByGift.get(gift._id.toString());
      
      if (winnerDraw) {
        // Ce cadeau a un gagnant
        return {
          giftId: gift._id,
          giftTitle: gift.title,
          winnerName: winnerDraw.winnerName,
          winnerCode: winnerDraw.winnerCode,
          winnerEmail: winnerDraw.winnerEmail,
          isDrawn: true,
          drawDate: winnerDraw.drawDate
        };
      } else {
        // Ce cadeau n'a pas encore de gagnant
        return {
          giftId: gift._id,
          giftTitle: gift.title,
          winnerName: "En attente",
          winnerCode: null,
          winnerEmail: null,
          isDrawn: false,
          drawDate: null
        };
      }
    });

    console.log(`✅ Envoi de ${results.length} résultats (${winnersByGift.size} gagnants + ${results.length - winnersByGift.size} en attente)`);
    
    res.json(results);

  } catch (err) {
    console.error("❌ Erreur récupération gagnants:", err);
    res.status(500).json({
      error: "Erreur serveur",
      message: err.message
    });
  }
};