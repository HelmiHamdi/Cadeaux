// cron/weeklyDraw.js
/*import cron from "node-cron";
import Gift from "../models/Gift.js";
import Participant from "../models/Participant.js";
import WeeklyDraw from "../models/WeeklyDraw.js";

cron.schedule("0 23 * * 0", async () => {
  console.log("🎯 Tirage hebdomadaire lancé...");

  const gifts = await Gift.find();
  const currentWeek = new Date().getWeek();

  for (const gift of gifts) {
    const participants = await Participant.find({ giftId: gift._id });
    if (participants.length === 0) continue;

    const winner =
      participants[Math.floor(Math.random() * participants.length)];

    await WeeklyDraw.create({
      week: currentWeek,
      giftId: gift._id,
      winnerCode: winner.code,
      winnerEmail: winner.email,
    });

    console.log(`🏆 Gagnant pour ${gift.title}: ${winner.email}`);
  }
});


Date.prototype.getWeek = function () {
  const oneJan = new Date(this.getFullYear(), 0, 1);
  return Math.ceil(((this - oneJan) / 86400000 + oneJan.getDay() + 1) / 7);
};*/
// cron/weeklyDraw.js
import cron from "node-cron";
import Gift from "../models/Gift.js";
import Participant from "../models/Participant.js";
import WeeklyDraw from "../models/WeeklyDraw.js";

cron.schedule("0 23 * * 0", async () => { // Dimanche 23h UTC = Lundi 00h Tunis
  console.log("🎯 Tirage hebdomadaire lancé...");
  
  try {
    const currentDate = new Date();
    const currentWeek = currentDate.getWeek();
    const currentYear = currentDate.getFullYear();

    const gifts = await Gift.find();
    
    for (const gift of gifts) {
      const participants = await Participant.find({ giftId: gift._id });
      
      if (!participants.length) {
        console.log(`Aucun participant pour ${gift.title}`);
        continue;
      }

      // Sélection aléatoire d'un gagnant
      const winner = participants[Math.floor(Math.random() * participants.length)];
      
      // Vérifier si un tirage existe déjà pour cette semaine
      let weeklyDraw = await WeeklyDraw.findOne({
        giftId: gift._id,
        week: currentWeek,
        year: currentYear
      });

      if (weeklyDraw) {
        // Mettre à jour le tirage existant
        weeklyDraw.winnerCode = winner.code;
        weeklyDraw.winnerEmail = winner.email;
        weeklyDraw.winnerName = `${winner.name} ${winner.surname}`;
        weeklyDraw.isDrawn = true;
        weeklyDraw.drawDate = currentDate;
        await weeklyDraw.save();
      } else {
        // Créer un nouveau tirage
        weeklyDraw = await WeeklyDraw.create({
          week: currentWeek,
          year: currentYear,
          giftId: gift._id,
          winnerCode: winner.code,
          winnerEmail: winner.email,
          winnerName: `${winner.name} ${winner.surname}`,
          giftTitle: gift.title,
          isDrawn: true,
          drawDate: currentDate
        });
      }

      console.log(`🏆 Gagnant pour ${gift.title}: ${winner.email} (Code: ${winner.code})`);
    }
  } catch (err) {
    console.error("Erreur tirage hebdomadaire:", err.message);
  }
});

// Helper pour semaine actuelle
Date.prototype.getWeek = function () {
  const oneJan = new Date(this.getFullYear(), 0, 1);
  return Math.ceil(((this - oneJan) / 86400000 + oneJan.getDay() + 1) / 7);
};