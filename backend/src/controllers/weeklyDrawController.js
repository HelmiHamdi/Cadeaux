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
    console.log("🎯 TEST - Récupération de TOUS les tirages...");
    
    // TEMPORAIRE: Récupérer TOUS les tirages au lieu de seulement cette semaine
    const weeklyDraws = await WeeklyDraw.find({
      isDrawn: true
    })
    .populate('giftId')
    .sort({ drawDate: -1 }) // Les plus récents en premier
    .limit(5); // Limiter à 5 comme sur le frontend

    console.log(`📊 ${weeklyDraws.length} tirages trouvés dans la base`);

    // Si pas de tirages du tout, retourner les cadeaux actuels
    if (weeklyDraws.length === 0) {
      console.log("❌ Aucun tirage trouvé dans la base");
      const gifts = await Gift.find().limit(5);
      const winners = gifts.map(gift => ({
        giftId: gift._id,
        giftTitle: gift.title,
        winnerName: "En attente",
        winnerCode: null,
        isDrawn: false
      }));
      return res.json(winners);
    }

    // Formater les gagnants
    const winners = weeklyDraws.map(draw => {
      console.log(`🏆 Tirage trouvé: ${draw.giftTitle} - ${draw.winnerName} - Code: ${draw.winnerCode}`);
      return {
        giftId: draw.giftId?._id || draw.giftId,
        giftTitle: draw.giftTitle || draw.giftId?.title || 'Cadeau sans titre',
        winnerName: draw.winnerName,
        winnerCode: draw.winnerCode,
        isDrawn: true,
        drawDate: draw.drawDate
      };
    });

    console.log("✅ Envoi des gagnants au frontend:", winners);
    res.json(winners);

  } catch (err) {
    console.error('❌ Erreur:', err);
    res.status(500).json({ error: err.message });
  }
};