import https from "https";
import fs from "fs";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import paymentRoutes from "./routes/paymentRoutes.js"; 

dotenv.config();
const app = express();

// Security / parsing middleware 
app.use(cors({
  origin: ["https://localhost:5173"], 
  methods: ["GET","POST","PUT","DELETE"],
}));
app.use(express.json({ limit: "10kb" }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/payments", paymentRoutes); 

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error(err));

// SSL (mkcert files)
const sslOptions = {
  key: fs.readFileSync("./ssl/localhost-key.pem"),
  cert: fs.readFileSync("./ssl/localhost.pem"), 
};

const PORT = process.env.PORT || 5000;
https.createServer(sslOptions, app).listen(PORT, () => {
  console.log(`🔒 HTTPS Server running at https://localhost:${PORT}`);
});
