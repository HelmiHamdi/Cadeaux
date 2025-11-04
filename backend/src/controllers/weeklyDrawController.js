// controllers/weeklyDrawController.js
import WeeklyDraw from "../models/WeeklyDraw.js";
import Gift from "../models/Gift.js";

/*export const getWeeklyWinners = async (req, res) => {
  try {
    const currentWeek = new Date().getWeek();
    const currentYear = new Date().getFullYear();

    // Récupérer tous les tirages de la semaine actuelle
    const weeklyDraws = await WeeklyDraw.find({
      week: currentWeek,
      year: currentYear,
      isDrawn: true
    }).populate('giftId');

    // Si pas de tirages cette semaine, retourner les cadeaux sans gagnants
    if (weeklyDraws.length === 0) {
      const gifts = await Gift.find().limit(5);
      const winners = gifts.map(gift => ({
        giftId: gift._id,
        giftTitle: gift.title,
        winnerName: "En attente",
        winnerCode: null, // ← Code caché avant tirage
        isDrawn: false
      }));
      return res.json(winners);
    }

    // Formater la réponse avec les gagnants
    const winners = weeklyDraws.map(draw => ({
      giftId: draw.giftId?._id || draw.giftId,
      giftTitle: draw.giftTitle,
      winnerName: draw.winnerName,
      winnerCode: draw.winnerCode, // ← Code visible seulement après tirage
      isDrawn: true,
      drawDate: draw.drawDate
    }));

    // Compléter avec les cadeaux sans tirage
    const allGifts = await Gift.find().limit(5);
    const giftIdsWithWinners = new Set(winners.map(w => w.giftId.toString()));
    
    allGifts.forEach(gift => {
      if (!giftIdsWithWinners.has(gift._id.toString())) {
        winners.push({
          giftId: gift._id,
          giftTitle: gift.title,
          winnerName: "En attente",
          winnerCode: null,
          isDrawn: false
        });
      }
    });

    res.json(winners);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};*/
export const getWeeklyWinners = async (req, res) => {
  try {
    console.log("🎯 Récupération des gagnants (un par cadeau)...");
    
    // Récupérer TOUS les cadeaux actifs
    const activeGifts = await Gift.find();
    console.log(`🎁 ${activeGifts.length} cadeaux actifs trouvés`);

    // Récupérer les gagnants
    const winners = await WeeklyDraw.find({ isDrawn: true })
      .sort({ drawDate: -1 })
      .populate('giftId');

    console.log(`📊 ${winners.length} tirages trouvés dans la base`);

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
        return {
          giftId: gift._id,
          giftTitle: gift.title,
          winnerName: winnerDraw.winnerName,
          winnerCode: winnerDraw.winnerCode,
          isDrawn: true,
          drawDate: winnerDraw.drawDate
        };
      } else {
        return {
          giftId: gift._id,
          giftTitle: gift.title,
          winnerName: "En attente",
          winnerCode: null,
          isDrawn: false
        };
      }
    });

    console.log(`✅ Envoi de ${results.length} résultats au frontend`);
    res.json(results);

  } catch (err) {
    console.error('❌ Erreur:', err);
    res.status(500).json({ error: err.message });
  }
};