import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema({
  title: String,
  price: Number,
  description: String,
});

// new
const priceSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["hourly", "per-day", "custom"],
  },
  amount: Number,
  description: String,
}); 

// new udated form
const photographerSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", unique: true },

    name: String,
    city: String,
    bio: String,
    experience: Number,

    categories: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Category" }
    ],

    portfolioImages: [String], // 👈 carousel images

    services: [
      {
        title: String,
        description: String,
      },
    ],

    pricePackages: [priceSchema],

    available: { type: Boolean, default: true },

    rating: { type: Number, default: 5 },
    totalReviews: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Photographer", photographerSchema);
