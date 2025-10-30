// models/WeeklyDraw.js
import mongoose from "mongoose";

const weeklyDrawSchema = new mongoose.Schema({
  week: Number,
  year: Number, // ← Ajouter l'année pour plus de précision
  giftId: { type: mongoose.Schema.Types.ObjectId, ref: "Gift" },
  winnerCode: String,
  winnerEmail: String,
  winnerName: String,
  giftTitle: String,
  isDrawn: { type: Boolean, default: false }, // ← Nouveau champ pour indiquer si le tirage a eu lieu
  drawDate: Date, // ← Date du tirage
}, { timestamps: true });

const WeeklyDraw = mongoose.model("WeeklyDraw", weeklyDrawSchema);
export default WeeklyDraw;