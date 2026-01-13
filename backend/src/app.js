import authRoutes from "./routes/auth.routes.js";
import photographerRoutes from "./routes/photographer.routes.js";
import bookingRoutes from "./routes/booking.routes.js";
import cookieParser from "cookie-parser";

import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

/* ✅ TRUST PROXY - RENDER.COM KE LIYE MUST */
app.set("trust proxy", 1);

/* ✅ CORS — PRODUCTION FIX */
const allowedOrigins = [
  "https://photoridefrontend.vercel.app",
  "https://photoridefrontend.onrender.com",
  "http://localhost:3000",
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = `CORS policy: ${origin} not allowed`;
      console.log("❌ CORS blocked:", origin);
      return callback(new Error(msg), false);
    }
    
    console.log("✅ CORS allowed:", origin);
    return callback(null, true);
  },
  credentials: true, // ✅ MUST be true
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  exposedHeaders: ["set-cookie"], // ✅ Expose set-cookie
}));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("API is running...");
});

// Test endpoint
app.get("/api/test", (req, res) => {
  res.json({
    status: "Backend is running",
    timestamp: new Date().toISOString(),
    node_env: process.env.NODE_ENV || "development",
    cookie_domain: process.env.COOKIE_DOMAIN || "Not set",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/photographers", photographerRoutes);
app.use("/api/bookings", bookingRoutes);

export default app;