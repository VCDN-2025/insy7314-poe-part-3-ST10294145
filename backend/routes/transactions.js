import express from "express";
import Transaction from "../models/Transaction.js";
import verifyToken from "../middleware/verifyToken.js";

const router = express.Router();

// CREATE transaction (users)
router.post("/create", verifyToken, async (req, res) => {
  try {
    console.log("=== CREATE TRANSACTION DEBUG ===");
    console.log("Request Body:", req.body);
    console.log("User from Token:", req.user);
    
    const { customerName, amount, currency, swiftCode, accountInfo } = req.body;
    const userId = req.user.id;

    // Validate required fields
    if (!customerName || !amount || !currency || !swiftCode || !accountInfo) {
      console.error("Missing required fields:", { customerName, amount, currency, swiftCode, accountInfo });
      return res.status(400).json({ 
        message: "Missing required fields",
        missing: {
          customerName: !customerName,
          amount: !amount,
          currency: !currency,
          swiftCode: !swiftCode,
          accountInfo: !accountInfo
        }
      });
    }

    // Validate userId exists
    if (!userId) {
      console.error("User ID not found in token");
      return res.status(401).json({ message: "Invalid token: user ID missing" });
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

    console.log("✅ Transaction created successfully:", transaction._id);
    res.status(201).json(transaction);
    
  } catch (err) {
    console.error("=== TRANSACTION CREATE ERROR ===");
    console.error("Error message:", err.message);
    console.error("Error name:", err.name);
    console.error("Error stack:", err.stack);
    
    // Handle Mongoose validation errors
    if (err.name === "ValidationError") {
      return res.status(400).json({ 
        message: "Validation error",
        errors: Object.keys(err.errors).map(key => ({
          field: key,
          message: err.errors[key].message
        }))
      });
    }
    
    res.status(500).json({ 
      message: "Transaction creation failed",
      error: process.env.NODE_ENV === "development" ? err.message : undefined
    });
  }
});

// GET pending transactions (employees)
router.get("/pending", verifyToken, async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({ createdAt: -1 });
    console.log(`✅ Fetched ${transactions.length} transactions`);
    res.status(200).json(transactions);
  } catch (err) {
    console.error("Fetching transactions failed:", err);
    res.status(500).json({ 
      message: "Failed to fetch transactions",
      error: process.env.NODE_ENV === "development" ? err.message : undefined
    });
  }
});

// UPDATE status (employees)
router.put("/status/:id", verifyToken, async (req, res) => {
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

    console.log(`✅ Updated transaction ${req.params.id} to ${status}`);
    res.status(200).json(transaction);
    
  } catch (err) {
    console.error("Updating transaction status failed:", err);
    res.status(500).json({ 
      message: "Failed to update status",
      error: process.env.NODE_ENV === "development" ? err.message : undefined
    });
  }
});

// SUBMIT approved transactions to SWIFT (dummy)
router.post("/submit", verifyToken, async (req, res) => {
  try {
    const { transactionIds } = req.body;

    if (!transactionIds || !Array.isArray(transactionIds) || transactionIds.length === 0) {
      return res.status(400).json({ message: "No transaction IDs provided" });
    }

    const result = await Transaction.updateMany(
      { _id: { $in: transactionIds }, status: "approved" },
      { status: "submitted" }
    );

    console.log(`✅ Submitted ${result.modifiedCount} transactions to SWIFT`);
    res.status(200).json({ 
      message: "Transactions submitted to SWIFT",
      count: result.modifiedCount
    });
    
  } catch (err) {
    console.error("Submit failed:", err);
    res.status(500).json({ 
      message: "Submit failed",
      error: process.env.NODE_ENV === "development" ? err.message : undefined
    });
  }
});

export default router;