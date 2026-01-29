import mongoose from "mongoose";
import Photographer from "../models/Photographer.js";
import Review from "../models/Review.js";

/**
 * ============================================================
 * CREATE OR UPDATE BASIC PROFILE (Photographer Only)
 * ============================================================
 */
export const createOrUpdateProfile = async (req, res) => {
  try {
    const data = {
      user: req.user.id,
      name: req.body.name,
      coverImage: req.body.coverImage,
      city: req.body.city,
      experience: req.body.experience,
      bio: req.body.bio,
      services: req.body.services,
      available: req.body.available,
    };

    const profile = await Photographer.findOneAndUpdate(
      { user: req.user.id },
      data,
      { upsert: true, new: true }
    );

    res.status(200).json(profile);
  } catch (error) {
    console.error("❌ createOrUpdateProfile:", error);
    res.status(500).json({ message: "Failed to update profile" });
  }
};

/**
 * ============================================================
 * GET MY PROFILE (Photographer)
 * ============================================================
 */
export const getMyProfile = async (req, res) => {
  try {
    const profile = await Photographer.findOne({ user: req.user.id });

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.status(200).json(profile);
  } catch (error) {
    console.error("❌ getMyProfile:", error);
    res.status(500).json({ message: "Failed to fetch profile" });
  }
};

/**
 * ============================================================
 * GET ALL PHOTOGRAPHERS (PUBLIC)
 * ============================================================
 */
export const getAllPhotographers = async (req, res) => {
  try {
    const photographers = await Photographer.find({ available: true })
      .select("name city rating experience coverImage services");

    res.status(200).json(photographers);
  } catch (error) {
    console.error("❌ getAllPhotographers:", error);
    res.status(500).json({ message: "Failed to fetch photographers" });
  }
};

/**
 * ============================================================
 * GET SINGLE PHOTOGRAPHER BY ID (PUBLIC)
 * ============================================================
 */
export const getPhotographerById = async (req, res) => {
  try {
    const { id } = req.params;

    // ✅ Prevent CastError
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid photographer ID" });
    }

    const photographer = await Photographer.findById(id);

    if (!photographer) {
      return res.status(404).json({ message: "Photographer not found" });
    }

    res.status(200).json(photographer);
  } catch (error) {
    console.error("❌ getPhotographerById:", error);
    res.status(500).json({
      message: "Server error while fetching photographer",
    });
  }
};

/**
 * ============================================================
 * GET FULL PHOTOGRAPHER PROFILE (PUBLIC)
 * Includes: Photographer + Reviews
 * ============================================================
 */
export const getPhotographerFullProfile = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid photographer ID" });
    }

    const photographer = await Photographer.findById(id)
      .populate("categories", "name")
      .populate("user", "email");

    if (!photographer) {
      return res.status(404).json({ message: "Photographer not found" });
    }

    const reviews = await Review.find({ photographer: id })
      .populate("user", "name");

    res.status(200).json({
      photographer,
      reviews,
    });
  } catch (error) {
    console.error("❌ getPhotographerFullProfile:", error);
    res.status(500).json({
      message: "Failed to load full profile",
    });
  }
};

/**
 * ============================================================
 * UPDATE FULL PROFILE (Photographer Only)
 * Supports partial updates
 * ============================================================
 */
export const updateFullProfile = async (req, res) => {
  try {
    const body = req.body || {};
    const updateData = {};

    // ✅ Basic fields
    if (body.name) updateData.name = body.name;
    if (body.city) updateData.city = body.city;
    if (body.bio) updateData.bio = body.bio;

    if (body.experience !== undefined) {
      updateData.experience = Number(body.experience || 0);
    }

    // ✅ Boolean-safe available flag
    if (body.available !== undefined) {
      updateData.available =
        body.available === true || body.available === "true";
    }

    // ✅ Categories (safe JSON parsing)
    if (body.categories) {
      try {
        updateData.categories = JSON.parse(body.categories);
      } catch {
        return res.status(400).json({ message: "Invalid categories format" });
      }
    }

    // ✅ Services (safe parsing)
    if (body.services) {
      try {
        updateData.services = JSON.parse(body.services).map((s) => ({
          title: s.title,
          description: s.description || "",
          price: Number(s.price || 0),
        }));
      } catch {
        return res.status(400).json({ message: "Invalid services format" });
      }
    }

    // ✅ Price Packages
    if (body.pricePackages) {
      try {
        updateData.pricePackages = JSON.parse(body.pricePackages).map((p) => ({
          type: p.type,
          description: p.description || "",
          amount: Number(p.amount || 0),
        }));
      } catch {
        return res
          .status(400)
          .json({ message: "Invalid pricePackages format" });
      }
    }

    // ✅ Portfolio Images (append only)
    if (req.files && req.files.length > 0) {
      updateData.$push = {
        portfolioImages: {
          $each: req.files.map((f) => f.path),
        },
      };
    }

    const photographer = await Photographer.findOneAndUpdate(
      { user: req.user.id },
      updateData,
      { upsert: true, new: true }
    );

    res.status(200).json({
      success: true,
      photographer,
    });
  } catch (error) {
    console.error("❌ updateFullProfile:", error);
    res.status(500).json({
      message: "Profile update failed",
    });
  }
};
