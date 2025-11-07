import express from "express";
import Transaction from "../models/Transaction.js";
import { authenticate, authorizeRole } from "../middleware/authMiddleware.js";

const router = express.Router();

// CREATE transaction (users only)
router.post("/create", authenticate, authorizeRole("user"), async (req, res) => {
  try {
    const { customerName, amount, currency, swiftCode, accountInfo } = req.body;
    const userId = req.user.id;

    if (!customerName || !amount || !currency || !swiftCode || !accountInfo) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const transaction = await Transaction.create({
      userId,
      customerName,
      amount: parseFloat(amount),
      currency,
      swiftCode,
      accountInfo,
      status: "pending",
    });

    res.status(201).json(transaction);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Transaction creation failed", error: err.message });
  }
});

// GET all pending transactions (employees only)
router.get("/pending", authenticate, authorizeRole("employee"), async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({ createdAt: -1 });
    res.status(200).json(transactions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch transactions", error: err.message });
  }
});

// GET transactions for a specific user
router.get("/user/:userId", authenticate, async (req, res) => {
  try {
    const { userId } = req.params;

    if (req.user.role !== "employee" && req.user.id !== userId) {
      return res.status(403).json({ message: "You can only view your own transactions" });
    }

    const transactions = await Transaction.find({ userId }).sort({ createdAt: -1 });
    res.json({ success: true, transactions });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch transactions", error: err.message });
  }
});

// UPDATE status (employees only)
router.put("/status/:id", authenticate, authorizeRole("employee"), async (req, res) => {
  try {
    const { status } = req.body;
    const validStatus = ["verified", "approved", "rejected"];

    if (!validStatus.includes(status)) {
      return res.status(400).json({ message: "Invalid status. Must be: verified, approved, or rejected" });
    }

    const transaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.status(200).json(transaction);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update status", error: err.message });
  }
});

export default router;
