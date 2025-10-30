// models/Gift.js
import mongoose from "mongoose";

const giftSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  image: String,
  week: Number,
},{ timestamps: true });

const Gift = mongoose.model("Gift", giftSchema);
export default Gift;
