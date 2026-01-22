import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  description: {
    type: String,
    default: "",
  },
});

const priceSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["hourly", "per-day", "custom"],
    required: true,
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  description: {
    type: String,
    default: "",
  },
});

const photographerSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      unique: true,
      required: true,
    },

    name: String,
    city: String,
    bio: String,
    experience: Number,

    categories: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    ],

    portfolioImages: [String],

    // ✅ FIXED SERVICES
    services: [serviceSchema],

    pricePackages: [priceSchema],

    available: { type: Boolean, default: true },

    rating: { type: Number, default: 5 },
    totalReviews: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Photographer", photographerSchema);
