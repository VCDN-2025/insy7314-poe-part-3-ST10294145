import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  console.log("\n🔐 === AUTH MIDDLEWARE ===");
  
  const authHeader = req.headers["authorization"];
  console.log("Authorization header:", authHeader);
  
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    console.error("❌ No token provided");
    return res.status(401).json({ 
      success: false,
      message: "Access denied. No token provided." 
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✅ Token decoded:", { id: decoded.id, role: decoded.role, userName: decoded.userName });
    
    if (!decoded.id) {
      console.error("❌ Token missing user ID");
      return res.status(403).json({ 
        success: false,
        message: "Invalid token: missing user ID." 
      });
    }
    
    req.user = decoded;
    console.log("✅ User authenticated successfully");
    next();
    
  } catch (err) {
    console.error("❌ Token verification failed:", err.message);
    
    if (err.name === "TokenExpiredError") {
      return res.status(403).json({ 
        success: false,
        message: "Token expired. Please login again." 
      });
    }
    
    return res.status(403).json({ 
      success: false,
      message: "Invalid token." 
    });
  }
};

export default authMiddleware;