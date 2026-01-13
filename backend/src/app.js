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

app.use(cors({
  origin: [
    "https://photoridefrontend.vercel.app",
    "https://photoridefrontend.onrender.com",
    "http://localhost:3000",
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.options("*", cors());

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