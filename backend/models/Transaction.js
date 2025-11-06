import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    customerName: { type: String, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    swiftCode: { type: String, required: true },
    accountInfo: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "verified", "approved", "rejected", "submitted"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const Transaction = mongoose.model("Transaction", transactionSchema);
export default Transaction;
