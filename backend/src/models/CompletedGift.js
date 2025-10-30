// models/CompletedGift.js
import mongoose from "mongoose";

const completedGiftSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  image: String,
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  participantsCount: { type: Number, default: 0 }, // nombre de participants
},{ timestamps: true });

const CompletedGift = mongoose.model("CompletedGift", completedGiftSchema);
export default CompletedGift;
