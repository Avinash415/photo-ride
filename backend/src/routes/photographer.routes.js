import express from "express";
import {
  createOrUpdateProfile,
  getMyProfile,
  getAllPhotographers,
  getPhotographerById,
} from "../controllers/photographer.controller.js";

import { protect } from "../middlewares/auth.middleware.js";
import { allowRoles } from "../middlewares/role.middleware.js";

const router = express.Router();

/* Photographer only */
router.post(
  "/profile",
  protect,
  allowRoles("photographer"),
  createOrUpdateProfile
);

router.get(
  "/profile/me",
  protect,
  allowRoles("photographer"),
  getMyProfile
);

/* Public */
router.get("/", getAllPhotographers);
router.get("/:id", getPhotographerById);

export default router;
