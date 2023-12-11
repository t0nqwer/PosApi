import { Schema, model } from "mongoose";

const posSchema = new Schema({
  cashdrawer: { type: Number },
  dateOpen: { type: Date },
  dateClose: { type: Date },
  status: { type: String, enum: ["open", "closed"], required: true },
  cashin: { type: Array },
  cashout: { type: Array },
  bills: { type: Array },
});

const Pos = model("Pos", posSchema);

export default Pos;
