import express from "express";
import Payment from "../models/Payment.js";

const router = express.Router();

// Can make a new payment
router.post("/create", async (req, res) => {
  try {
    const { customerId, amount, currency, provider, payeeAccount, swiftCode } = req.body;

    if (!customerId || !amount || !currency || !provider || !payeeAccount || !swiftCode) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const payment = new Payment({
      customerId,
      amount,
      currency,
      provider,
      payeeAccount,
      swiftCode,
    });

    await payment.save();
    res.status(201).json({ message: "Payment created successfully", payment });
  } catch (error) {
    console.error("Payment creation error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all payments (for employees to view)
router.get("/", async (req, res) => {
  try {
    const payments = await Payment.find().sort({ date: -1 });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch payments" });
  }
});

// Verify a payment
router.put("/verify/:id", async (req, res) => {
  try {
    const payment = await Payment.findByIdAndUpdate(
      req.params.id,
      { status: "Verified" },
      { new: true }
    );
    if (!payment) return res.status(404).json({ message: "Payment not found" });
    res.json({ message: "Payment verified successfully", payment });
  } catch (error) {
    res.status(500).json({ message: "Failed to verify payment" });
  }
});

export default router;
