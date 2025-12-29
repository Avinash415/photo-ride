import authRoutes from "./routes/auth.routes.js";
import photographerRoutes from "./routes/photographer.routes.js";
import bookingRoutes from "./routes/booking.routes.js";
import cookieParser from "cookie-parser";


import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
  origin: "https://photoridefrontend.vercel.app",
  credentials: true
}));

app.get("/", (req, res) => {
  res.send("API is running...");
});
app.use("/api/auth", authRoutes);
app.use("/api/photographers", photographerRoutes);
app.use("/api/bookings", bookingRoutes);

export default app;
