import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // "Bearer <token>"

  if (!token) {
    console.error("❌ No token provided");
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Ensure decoded token has required fields
    if (!decoded.id) {
      console.error("❌ Token missing user ID");
      return res.status(403).json({ message: "Invalid token: missing user ID." });
    }
    
    req.user = decoded; // attach user info to request
    console.log("✅ Token verified for user:", decoded.id);
    next();
    
  } catch (err) {
    console.error("❌ Token verification failed:", err.message);
    
    if (err.name === "TokenExpiredError") {
      return res.status(403).json({ message: "Token expired." });
    }
    
    res.status(403).json({ message: "Invalid token." });
  }
};

export default verifyToken;