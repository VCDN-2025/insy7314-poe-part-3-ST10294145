import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

// ==================== REGISTER ====================
router.post("/register", async (req, res) => {
  console.log("\n📝 === REGISTER ATTEMPT ===");
  console.log("Request body:", req.body);
  
  const { name, email, password, role } = req.body;
  
  // Validation
  if (!name || !email || !password) {
    console.log("❌ Missing required fields");
    return res.status(400).json({ 
      success: false,
      message: "Name, email, and password are required" 
    });
  }

  if (password.length < 6) {
    console.log("❌ Password too short");
    return res.status(400).json({ 
      success: false,
      message: "Password must be at least 6 characters" 
    });
  }
  
  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      console.log("❌ User already exists:", email);
      return res.status(400).json({ 
        success: false,
        message: "User with this email already exists" 
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("✅ Password hashed successfully");
    
    // Create user
    const newUser = new User({ 
      name, 
      email: email.toLowerCase(),
      password: hashedPassword,
      role: role || "user"
    });
    
    await newUser.save();
    console.log("✅ User created successfully:", newUser.email, "| Role:", newUser.role);
    
    res.status(201).json({ 
      success: true,
      message: "User registered successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
    });
    
  } catch (err) {
    console.error("❌ Registration error:", err);
    res.status(500).json({ 
      success: false,
      message: "Registration failed", 
      error: err.message 
    });
  }
});

// ==================== LOGIN ====================
router.post("/login", async (req, res) => {
  console.log("\n🔑 === LOGIN ATTEMPT ===");
  console.log("Request body:", req.body);
  
  const { email, password } = req.body;
  
  // Validation
  if (!email || !password) {
    console.log("❌ Missing email or password");
    return res.status(400).json({ 
      success: false,
      message: "Email and password are required" 
    });
  }
  
  try {
    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      console.log("❌ User not found:", email);
      return res.status(400).json({ 
        success: false,
        message: "Invalid email or password" 
      });
    }

    console.log("✅ User found:", user.email, "| Role:", user.role);

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Password match:", isMatch);
    
    if (!isMatch) {
      console.log("❌ Password mismatch");
      return res.status(400).json({ 
        success: false,
        message: "Invalid email or password" 
      });
    }

    // Create JWT token
    const token = jwt.sign(
      { 
        id: user._id, 
        role: user.role,
        userName: user.name
      }, 
      process.env.JWT_SECRET, 
      { expiresIn: "24h" }
    );

    console.log("✅ Login successful for:", user.email);
    console.log("Token payload:", { id: user._id, role: user.role, userName: user.name });

    res.json({ 
      success: true,
      message: "Login successful",
      token, 
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
    
  } catch (err) {
    console.error("❌ Login error:", err);
    res.status(500).json({ 
      success: false,
      message: "Login failed", 
      error: err.message 
    });
  }
});

// ==================== VERIFY TOKEN ====================
router.get("/verify", async (req, res) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ 
      success: false,
      message: "No token provided" 
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: "User not found" 
      });
    }

    res.json({ 
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
    
  } catch (err) {
    res.status(403).json({ 
      success: false,
      message: "Invalid token" 
    });
  }
});

export default router;