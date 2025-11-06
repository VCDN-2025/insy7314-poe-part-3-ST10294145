import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  customerId: { type: String, required: true },
  amount: { type: Number, required: true },
  currency: { type: String, required: true },
  provider: { type: String, required: true },
  payeeAccount: { type: String, required: true },
  swiftCode: { type: String, required: true },
  status: { type: String, default: "Pending" },
  date: { type: Date, default: Date.now },
});

export default mongoose.model("Payment", paymentSchema);
