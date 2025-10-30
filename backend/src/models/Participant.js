// models/Participant.js
import mongoose from "mongoose";

const participantSchema = new mongoose.Schema({
  giftId: { type: mongoose.Schema.Types.ObjectId, ref: "Gift", required: true },
  name: String,
  surname: String,
  email: String,
  phone: String,
  code: String,
},{ timestamps: true });

const Participant = mongoose.model("Participant", participantSchema);
export default Participant;
