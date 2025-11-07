import express from "express";
import Payment from "../models/Payment.js";
import { authenticate, authorizeRole } from "../middleware/authMiddleware.js";

const router = express.Router();

// Regex validators
const amountRegex = /^\d+(\.\d{1,2})?$/; // allows numbers with up to 2 decimal places
const currencyRegex = /^(USD|EUR|ZAR)$/;
const accountRegex = /^[a-zA-Z0-9]{5,30}$/;
const swiftRegex = /^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/;
const providerRegex = /^[a-zA-Z\s]{2,50}$/;

// Validate payment input
function validatePaymentInput({ amount, currency, provider, payeeAccount, swiftCode }) {
  if (!amountRegex.test(amount)) return "Invalid amount";
  if (!currencyRegex.test(currency)) return "Invalid currency";
  if (!providerRegex.test(provider)) return "Invalid provider name";
  if (!accountRegex.test(payeeAccount)) return "Invalid account info";
  if (!swiftRegex.test(swiftCode)) return "Invalid SWIFT code";
  return null;
}

/**
 * POST /api/payments
 * Create a payment (user only)
 */
router.post("/", authenticate, authorizeRole("user"), async (req, res) => {
  try {
    const { customerId, amount, currency, provider, payeeAccount, swiftCode } = req.body;

    const error = validatePaymentInput({ amount, currency, provider, payeeAccount, swiftCode });
    if (error) return res.status(400).json({ message: error });

    const payment = new Payment({
      customerId: customerId || req.user._id.toString(),
      amount: parseFloat(amount),
      currency,
      provider,
      payeeAccount,
      swiftCode,
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
