// controllers/giftController.js
import Gift from "../models/Gift.js";
import Participant from "../models/Participant.js";
import CompletedGift from "../models/CompletedGift.js"; // ← AJOUTEZ CET IMPORT
import { generateCode } from "../utils/codeGenerator.js";
import { sendEmail } from "../utils/email.js";


export const addGift = async (req, res) => {
  try {
    const gift = await Gift.create(req.body);
    res.status(201).json(gift);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const getAllGifts = async (req, res) => {
  try {
    const gifts = await Gift.find();
    res.json(gifts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const participateInGift = async (req, res) => {
  const { name, surname, email, phone } = req.body;
  const giftId = req.params.id;

  try {
   
    const existing = await Participant.findOne({ giftId, email });
    if (existing) {
      return res
        .status(400)
        .json({ message: "Déjà participé à ce cadeau !" });
    }

    // Générer un code unique
    const code = generateCode();

    // Créer le participant
    const participant = await Participant.create({
      giftId,
      name,
      surname,
      email,
      phone,
      code,
    });

    // Envoyer un email de confirmation
   /* await sendEmail(
      email,
      "Votre code de participation 🎁",
      `<h2>Bonjour ${name} ${surname},</h2>
       <p>Merci pour votre participation !</p>
       <p>Votre code unique :</p>
       <h1 style="color:green;">${code}</h1>
       <p>Bonne chance 🍀</p>`
    );*/

    res.status(201).json({ message: "Participation enregistrée !" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * ⚙️ Fonction d'archivage automatique des anciens cadeaux - VERSION CORRIGÉE
 */
export const archiveGifts = async ({ giftIds = null, limit = 5, newGifts = [] } = {}) => {
  const result = { archived: [], inserted: [] };

  try {
    let giftsToArchive;
    if (giftIds && giftIds.length > 0) {
      giftsToArchive = await Gift.find({ _id: { $in: giftIds } });
    } else {
      giftsToArchive = await Gift.find().sort({ createdAt: 1 }).limit(limit);
    }

    console.log(`📦 Archivage de ${giftsToArchive.length} cadeaux...`);

    for (const gift of giftsToArchive) {
      const participantsCount = await Participant.countDocuments({ giftId: gift._id });

      console.log(`📋 Archivage du cadeau: ${gift.title} (${participantsCount} participants)`);

      // Vérifier si CompletedGift est disponible
      if (typeof CompletedGift === 'undefined') {
        throw new Error('CompletedGift model is not defined');
      }

      const completed = await CompletedGift.create({
        title: gift.title,
        description: gift.description,
        image: gift.image,
        startDate: gift.createdAt || new Date(),
        endDate: new Date(),
        participantsCount,
      });

      await Gift.deleteOne({ _id: gift._id });

      result.archived.push({
        giftId: gift._id,
        title: gift.title,
        completedId: completed._id,
        participantsCount,
      });

      console.log(`✅ Cadeau archivé: ${gift.title}`);
    }

    if (newGifts && newGifts.length > 0) {
      console.log(`🎁 Ajout de ${newGifts.length} nouveaux cadeaux...`);
      const inserted = await Gift.insertMany(newGifts);
      result.inserted = inserted.map((i) => ({ id: i._id, title: i.title }));
      console.log(`✅ ${inserted.length} nouveaux cadeaux ajoutés`);
    }

    return result;
  } catch (err) {
    console.error('❌ Erreur lors de l\'archivage:', err);
    throw err;
  }
};

/**
 * 🗄️ Route manuelle pour archiver les cadeaux (simple)
 */
export const archiveGiftsRoute = async (req, res) => {
  try {
    const { giftIds, limit, newGifts } = req.body || {};
    const summary = await archiveGifts({ giftIds, limit, newGifts });
    res.json({ message: "Archivage effectué", summary });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};