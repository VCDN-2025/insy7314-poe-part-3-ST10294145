import express from "express";
import Payment from "../models/Payment.js";
import { authenticate, authorizeRole } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * POST /api/payments
 * Create a payment (user only)
 * body: { customerId, amount, currency, provider, payeeAccount, swiftCode }
 */
router.post("/", authenticate, authorizeRole("user"), async (req, res) => {
  try {
    // Ensure the customerId is consistent with logged-in user if needed:
    // const customerId = req.body.customerId || req.user._id.toString();
    const payment = new Payment({
      customerId: req.body.customerId || req.user._id.toString(),
      amount: req.body.amount,
      currency: req.body.currency,
      provider: req.body.provider,
      payeeAccount: req.body.payeeAccount,
      swiftCode: req.body.swiftCode,
      status: "Pending"
    });

    const saved = await payment.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not create payment" });
  }
});

/**
 * GET /api/payments/mine
 * Get payments for the logged-in user
 */
router.get("/mine", authenticate, authorizeRole("user"), async (req, res) => {
  try {
    const payments = await Payment.find({ customerId: req.user._id.toString() }).sort({ date: -1 });
    res.json(payments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * GET /api/payments
 * Employee: view all payments (with optional ?status=Pending)
 */
router.get("/", authenticate, authorizeRole("employee"), async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    const payments = await Payment.find(filter).sort({ date: -1 });
    res.json(payments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * PATCH /api/payments/:id/approve
 * Employee approves a payment
 */
router.patch("/:id/approve", authenticate, authorizeRole("employee"), async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) return res.status(404).json({ message: "Payment not found" });
    if (payment.status === "Approved") return res.status(400).json({ message: "Already approved" });

    payment.status = "Approved";
    await payment.save();
    res.json(payment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not approve payment" });
  }
});

/**
 * PATCH /api/payments/:id/reject
 * Employee rejects a payment
 */
router.patch("/:id/reject", authenticate, authorizeRole("employee"), async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) return res.status(404).json({ message: "Payment not found" });
    if (payment.status === "Rejected") return res.status(400).json({ message: "Already rejected" });

    payment.status = "Rejected";
    await payment.save();
    res.json(payment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not reject payment" });
  }
});

export default router;
