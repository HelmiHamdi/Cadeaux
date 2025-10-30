/*import express from "express";
import Gift from "../models/Gift.js";
import Participant from "../models/Participant.js";
import { generateCode } from "../utils/codeGenerator.js";
import { sendEmail } from "../utils/email.js";

const router = express.Router();

// ➕ Ajouter un cadeau (pour test)
router.post("/", async (req, res) => {
  try {
    const gift = await Gift.create(req.body);
    res.status(201).json(gift);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📦 Lister les cadeaux
router.get("/", async (req, res) => {
  const gifts = await Gift.find();
  res.json(gifts);
});

// 🎯 Participer à un cadeau
router.post("/:id/participate", async (req, res) => {
  const { name, surname, email, phone } = req.body;
  const giftId = req.params.id;

  try {
    const existing = await Participant.findOne({ giftId, email });
    if (existing)
      return res.status(400).json({ message: "Déjà participé à ce cadeau !" });

    const code = generateCode();
    const participant = await Participant.create({
      giftId,
      name,
      surname,
      email,
      phone,
      code,
    });

    await sendEmail(
      email,
      "Votre code de participation 🎁",
      `<h2>Bonjour ${name} ${surname},</h2>
       <p>Merci pour votre participation !</p>
       <p>Votre code unique :</p>
       <h1 style="color:green;">${code}</h1>
       <p>Bonne chance 🍀</p>`
    );

    res.status(201).json({ message: "Participation enregistrée !" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;*/
// routes/giftRoutes.js
import express from "express";
import {
  addGift,
  getAllGifts,
  participateInGift,
  archiveGiftsRoute,
} from "../controllers/giftController.js";

const router = express.Router();

// ➕ Ajouter un cadeau
router.post("/", addGift);

// 📦 Lister les cadeaux
router.get("/", getAllGifts);

// 🎯 Participer à un cadeau
router.post("/:id/participate", participateInGift);

router.post("/archive", archiveGiftsRoute);

export default router;

