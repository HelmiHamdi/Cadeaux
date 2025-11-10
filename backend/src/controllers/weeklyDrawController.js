// controllers/weeklyDrawController.js
import WeeklyDraw from "../models/WeeklyDraw.js";
import Gift from "../models/Gift.js";

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