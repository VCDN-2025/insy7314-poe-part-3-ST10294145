import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

// REGISTER
router.post("/register", async (req, res) => {
  const { name, email, password, role } = req.body; // 🔴 ADD: Get role from request
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ 
      name, 
      email, 
      password: hashedPassword,
      role: role || "user" // 🔴 ADD: Use provided role or default to "user"
    });
    await newUser.save();
    res.status(201).json({ message: "User registered" });
  } catch (err) {
    res.status(500).json({ message: "Registration failed", error: err.message });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  console.log("=== LOGIN ATTEMPT ===");
  console.log("Request body:", req.body);
  
  const { email, password } = req.body;
  
  // Validate input
  if (!email || !password) {
    console.log("❌ Missing email or password");
    return res.status(400).json({ message: "Email and password are required" });
  }
  
  try {
    const user = await User.findOne({ email });
    
    if (!user) {
      console.log("❌ User not found:", email);
      return res.status(400).json({ message: "Invalid credentials" });
    }

    console.log("✅ User found:", user.email, "| Role:", user.role);

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Password match:", isMatch);
    
    if (!isMatch) {
      console.log("❌ Password mismatch");
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Include user name in JWT token
    const token = jwt.sign(
      { 
        id: user._id, 
        role: user.role,
        userName: user.name
      }, 
      process.env.JWT_SECRET, 
      { expiresIn: "1h" }
    );

    console.log("✅ Login successful for:", user.email);

    // Return userName in response
    res.json({ 
      token, 
      role: user.role,
      userName: user.name
    });
  } catch (err) {
    console.error("❌ Login error:", err);
    res.status(500).json({ message: "Login failed", error: err.message });
  }
});

export default router;