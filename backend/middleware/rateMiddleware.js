import rateLimit from "express-rate-limit";


export const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 200, // max requests per IP per window
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many requests from this IP, try again later." }
});


export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 6, // max 6 login attempts per IP per window
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    // custom response when blocked
    res.status(429).json({ message: "Too many login attempts. Please try again later." });
  }
});
