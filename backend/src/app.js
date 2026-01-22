import authRoutes from "./routes/auth.routes.js";
import photographerRoutes from "./routes/photographer.routes.js";
import bookingRoutes from "./routes/booking.routes.js";
import cookieParser from "cookie-parser";

import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      // Add your production frontend once deployed
      "https://photoridefrontend.vercel.app",
    ],
    credentials: true, 
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    // Optional but recommended in production
    optionsSuccessStatus: 200, 
  })
);

app.use(cookieParser());
// app.use(express.json({ limit: "10mb" }));
// app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use((req, res, next) => {
  const contentType = req.headers["content-type"] || "";

  // 🚫 Skip JSON parsing for multipart/form-data
  if (contentType.includes("multipart/form-data")) {
    return next();
  }

  express.json({ limit: "10mb" })(req, res, next);
});


app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use("/api/auth", authRoutes);
app.use("/api/photographers", photographerRoutes);
app.use("/api/bookings", bookingRoutes);

export default app;
