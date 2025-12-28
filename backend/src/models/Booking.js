import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    photographer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Photographer",
      required: true,
    },
    serviceTitle: {
      type: String,
      required: true,
    },
    servicePrice: {
      type: Number,
      required: true,
    },
    bookingDate: {
      type: Date,
      required: true,
    },
    note: {
      type: String,
    },
    status: {
      type: String,
      enum: ["PENDING", "ACCEPTED", "REJECTED", "COMPLETED"],
      default: "PENDING",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Booking", bookingSchema);
