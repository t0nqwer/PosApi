import { Schema, model } from "mongoose";

const billSchema = new Schema({
  name: { type: String, required: true },
  date: { type: Date },
  products: Array,
  customProducts: Array,
  payment: {
    type: String,
    enum: ["cash", "credit", "transfer"],
  },
  totalBfDiscount: { type: Number, default: 0 },
  cash: { type: Number, default: 0 },
  change: { type: Number, default: 0 },
  active: {
    type: String,
    enum: ["active", "purchase", "delete"],
    default: "active",
  },
  disamout: { type: Number },
  distype: {
    type: String,
    enum: ["percent", "int"],
  },
  totalPay: { type: Number },
  IsOnline: { type: Boolean, default: false },
  amount: { type: Number },
  IsBillFinish: { type: Boolean, default: false },
});

const Bill = model("Bill", billSchema);

export default Bill;
