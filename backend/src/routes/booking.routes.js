import express from "express";
import {
  createBooking,
  getPhotographerBookings,
  updateBookingStatus,
  getCustomerBookings,
} from "../controllers/booking.controller.js";

import { protect } from "../middlewares/auth.middleware.js";
import { allowRoles } from "../middlewares/role.middleware.js";

const router = express.Router();

/* CUSTOMER */
router.post("/", protect, allowRoles("customer"), createBooking);
router.get("/my", protect, allowRoles("customer"), getCustomerBookings);

/* PHOTOGRAPHER */
router.get(
  "/photographer",
  protect,
  allowRoles("photographer"),
  getPhotographerBookings
);

router.patch(
  "/:id/status",
  protect,
  allowRoles("photographer"),
  updateBookingStatus
);

export default router;
