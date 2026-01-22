import express from "express";
import {
  createOrUpdateProfile,
  getMyProfile,
  getAllPhotographers,
  getPhotographerById,
  getPhotographerFullProfile,
   updateFullProfile
} from "../controllers/photographer.controller.js";

import { upload } from "../middlewares/upload.middleware.js";

import { protect } from "../middlewares/auth.middleware.js";
import { allowRoles } from "../middlewares/role.middleware.js";

const router = express.Router();

/* Photographer only */

router.put(
  "/profile/full",
  protect,
  allowRoles("photographer"),
  upload.array("images", 10),
  updateFullProfile
);

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
// new added
router.get("/:id/full-profile", getPhotographerFullProfile);


export default router;
