import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: { type: String, unique: true },
    password: String,
    role: {
      type: String,
      enum: ["customer", "photographer", "admin"],
      default: "customer",
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
