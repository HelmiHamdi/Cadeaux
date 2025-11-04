import Participant from "../models/Participant.js";
import Gift from "../models/Gift.js";

// 📋 Récupérer tous les codes participants pour un cadeau
export const getGiftCodes = async (req, res) => {
  try {
    const { giftId } = req.params;

    // Vérifier si le cadeau existe
    const gift = await Gift.findById(giftId);
    if (!gift) {
      return res.status(404).json({
        error: "Cadeau non trouvé",
        message: "Le cadeau spécifié n'existe pas"
      });
    }

    // Récupérer tous les participants avec leurs codes
    const participants = await Participant.find({ giftId })
      .select('code name surname email createdAt')
      .sort({ createdAt: -1 });

    res.json({
      gift: {
        id: gift._id,
        title: gift.title,
        description: gift.description
      },
      participants: participants.map(p => ({
        id: p._id,
        code: p.code,
        name: p.name,
        surname: p.surname,
        email: p.email,
        participationDate: p.createdAt
      })),
      totalCodes: participants.length
    });
  } catch (err) {
    console.error("❌ Erreur récupération codes:", err);
    res.status(500).json({ 
      error: "Erreur serveur",
      message: err.message 
    });
  }
};

// 🔍 Rechercher un participant par code
export const searchParticipantByCode = async (req, res) => {
  try {
    const { code } = req.params;

    if (!code || code.trim() === '') {
      return res.status(400).json({
        error: "Code invalide",
        message: "Le code de recherche est requis"
      });
    }

    // Rechercher le participant par code
    const participant = await Participant.findOne({ code: code.trim() })
      .populate('giftId', 'title description');

    if (!participant) {
      return res.status(404).json({
        error: "Participant non trouvé",
        message: "Aucun participant trouvé avec ce code"
      });
    }

    res.json({
      participant: {
        id: participant._id,
        code: participant.code,
        name: participant.name,
        surname: participant.surname,
        email: participant.email,
        phone: participant.phone,
        participationDate: participant.createdAt,
        gift: {
          id: participant.giftId._id,
          title: participant.giftId.title,
          description: participant.giftId.description
        }
      }
    });
  } catch (err) {
    console.error("❌ Erreur recherche participant:", err);
    res.status(500).json({ 
      error: "Erreur serveur",
      message: err.message 
    });
  }
};

// 🔍 Rechercher plusieurs participants par codes
// 🔍 Rechercher plusieurs participants par codes
export const searchParticipantsByCodes = async (req, res) => {
  try {
    const { codes } = req.body;

    if (!codes || !Array.isArray(codes) || codes.length === 0) {
      return res.status(400).json({
        error: "Codes invalides",
        message: "La liste des codes est requise"
      });
    }

    // SUPPRIMER LA LIMITATION À 5 CODES
    const searchCodes = codes.map(code => code.trim());

    // Rechercher les participants par codes
    const participants = await Participant.find({ 
      code: { $in: searchCodes } 
    })
    .populate('giftId', 'title description')
    .sort({ createdAt: -1 });

    const foundCodes = participants.map(p => p.code);
    const notFoundCodes = searchCodes.filter(code => !foundCodes.includes(code));

    res.json({
      participants: participants.map(p => ({
        id: p._id,
        code: p.code,
        name: p.name,
        surname: p.surname,
        email: p.email,
        phone: p.phone,
        participationDate: p.createdAt,
        gift: {
          id: p.giftId._id,
          title: p.giftId.title,
          description: p.giftId.description
        }
      })),
      notFoundCodes,
      totalFound: participants.length,
      totalSearched: searchCodes.length
    });
  } catch (err) {
    console.error("❌ Erreur recherche multiple:", err);
    res.status(500).json({ 
      error: "Erreur serveur",
      message: err.message 
    });
  }
};