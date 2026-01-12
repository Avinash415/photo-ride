import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { generateToken } from "../utils/jwt.js";

/* ================= COOKIE OPTIONS ================= */
const getCookieOptions = () => {
  const isProduction = process.env.NODE_ENV === "production";

  return {
    httpOnly: true,
    secure: isProduction, // HTTPS only in prod
    sameSite: "none", // REQUIRED for cross-site
    path: "/",
    maxAge: 24 * 60 * 60 * 1000,
  };
};

/* ================= REGISTER ================= */
export const register = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "User exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    const token = generateToken(user);

    // ✅ Use dynamic cookie options
    const cookieOptions = getCookieOptions();
    res.cookie("token", token, cookieOptions);

    res.json({
      message: "Registered successfully",
      role: user.role,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= LOGIN ================= */
export const login = async (req, res) => {
  const { email, password } = req.body;

  console.log("🔍 Login attempt for:", email);
  console.log("🔍 Request origin:", req.headers.origin);

  try {
    const user = await User.findOne({ email });

    if (!user) {
      console.log("❌ User not found:", email);
      return res.status(400).json({ message: "Invalid credentials" });
    }

    console.log("✅ User found:", user.email);

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("🔍 Password match:", isMatch);

    if (!isMatch) {
      console.log("❌ Password mismatch for:", email);
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user);
    console.log("✅ Token generated for:", user.email);

    // ✅ Use dynamic cookie options
    const cookieOptions = getCookieOptions();
    res.cookie("token", token, cookieOptions);

    console.log("✅ Cookie set with options:", cookieOptions);

    res.json({
      success: true,
      message: "Logged in successfully",
      role: user.role,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("❌ Login error:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/* ================= LOGOUT ================= */
export const logout = (req, res) => {
  const isProduction = process.env.NODE_ENV === "production";

  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
  });

  res.json({ message: "Logged out" });
};

/* ================= PROTECT MIDDLEWARE ================= */
export const protect = (req, res, next) => {
  let token;

  // Cookie se token
  if (req.cookies?.token) {
    token = req.cookies.token;
  }

  // Header fallback
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

/* ================= GET CURRENT USER ================= */
export const getMe = async (req, res) => {
  try {
    // Token verify karo
    let token;

    if (req.cookies?.token) {
      token = req.cookies.token;
    } else if (req.headers.authorization?.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // User details fetch karo
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ user });
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};
