import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema({
  title: String,
  price: Number,
  description: String,
});

const photographerSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    name: String,              // 👈 frontend direct use
    coverImage: String,        // 👈 frontend image
    city: String,
    experience: Number,
    bio: String,
    services: [serviceSchema],
    available: {
      type: Boolean,
      default: true,
    },
    rating: {
      type: Number,
      default: 5,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Photographer", photographerSchema);
