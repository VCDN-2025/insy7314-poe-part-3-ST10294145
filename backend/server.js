import https from "https";
import fs from "fs";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import rateLimit from "express-rate-limit"; 
import authRoutes from "./routes/authRoutes.js"; 
import paymentRoutes from "./routes/paymentRoutes.js";
import transactionRoutes from "./routes/transactions.js";

dotenv.config();

const app = express();

// Middleware 

// CORS
app.use(cors({
  origin: ["https://localhost:5173"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
}));

// Body parser
app.use(express.json({ limit: "10kb" }));

// Helmet
app.use(helmet());

// Rate Limiter 

// Global API limiter (100 requests per 15 minutes per IP)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too many requests from this IP, please try again later."
});

app.use("/api", apiLimiter); 

// Routes 
app.use("/api/auth", authRoutes);          
app.use("/api/payments", paymentRoutes);   
app.use("/api/transactions", transactionRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// MongoDB 
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

// SSL certs
const sslOptions = {
  key: fs.readFileSync("./ssl/localhost-key.pem"),
  cert: fs.readFileSync("./ssl/localhost.pem"),
};

const PORT = process.env.PORT || 5000;

https.createServer(sslOptions, app).listen(PORT, () => {
  console.log(`🔒 HTTPS Server running at https://localhost:${PORT}`);
});

// Global error handler 
app.use((err, req, res, next) => {
  console.error("Global error handler:", err);
  res.status(500).json({
    message: "Internal server error",
    error: process.env.NODE_ENV === "development" ? err.message : undefined
  });
});
