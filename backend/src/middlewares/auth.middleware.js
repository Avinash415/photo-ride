import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
  let token;

  // 1. Pehle cookie se token lo
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  // 2. Agar cookie nahi to header se (purane logins ke liye fallback)
  if (!token && req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};