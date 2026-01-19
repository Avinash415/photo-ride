import mongoose from "mongoose";
import Photographer from "../models/Photographer.js";
import Review from "../models/Review.js";
import Category from "../models/Category.js";

/**
 * CREATE / UPDATE PROFILE (Photographer Only)
 */
export const createOrUpdateProfile = async (req, res) => {
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

  res.json(profile);
};

/**
 * GET MY PROFILE (Photographer)
 */
export const getMyProfile = async (req, res) => {
  const profile = await Photographer.findOne({ user: req.user.id });
  res.json(profile);
};

/**
 * ✅ GET ALL PHOTOGRAPHERS (PUBLIC)
 * Used in: Find Photographer Page
 */
export const getAllPhotographers = async (req, res) => {
  const photographers = await Photographer.find({ available: true }).select(
    "name city rating experience coverImage services"
  );

  res.json(photographers);
};

/**
 * ✅ GET SINGLE PHOTOGRAPHER (PUBLIC)
 * Used in: Photographer Details Page
 */

export const getPhotographerById = async (req, res) => {
  const { id } = req.params;

  // ✅ Prevent CastError
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid photographer ID" });
  }

  const photographer = await Photographer.findById(id);

  if (!photographer) {
    return res.status(404).json({ message: "Photographer not found" });
  }

  res.json(photographer);
};


// new added 
export const getPhotographerFullProfile = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid ID" });
  }

  const photographer = await Photographer.findById(id)
    .populate("categories", "name")
    .populate("user", "email");

  if (!photographer) {
    return res.status(404).json({ message: "Not found" });
  }

  const reviews = await Review.find({ photographer: id })
    .populate("user", "name");

  res.json({
    photographer,
    reviews,
  });
};

export const updateFullProfile = async (req, res) => {
  const {
    name,
    city,
    bio,
    experience,
    categories,
    services,
    pricePackages,
    available,
  } = req.body;

  const portfolioImages = req.files?.map(f => f.path) || [];

  const photographer = await Photographer.findOneAndUpdate(
    { user: req.user.id },
    {
      name,
      city,
      bio,
      experience,
      categories,
      services,
      pricePackages,
      available,
      $push: { portfolioImages: { $each: portfolioImages } },
    },
    { upsert: true, new: true }
  );

  res.json(photographer);
};


