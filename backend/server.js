import https from "https";
import fs from "fs";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error(err));

const sslOptions = {
  key: fs.readFileSync("./ssl/localhost-key.pem"),
  cert: fs.readFileSync("./ssl/localhost.pem"),
};

const PORT = process.env.PORT || 5000;
https.createServer(sslOptions, app).listen(PORT, () => {
  console.log(`🔒 HTTPS Server running at https://localhost:${PORT}`);
});
