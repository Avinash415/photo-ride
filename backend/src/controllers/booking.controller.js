import Booking from "../models/Booking.js";
import Photographer from "../models/Photographer.js";

/**
 * CUSTOMER → CREATE BOOKING
 */
export const createBooking = async (req, res) => {
  try {
    const {
      photographerId,
      serviceTitle,
      servicePrice,
      bookingDate,
      note,
    } = req.body;

    if (!serviceTitle || !servicePrice || !bookingDate) {
      return res.status(400).json({
        message: "All booking fields are required",
      });
    }

    const photographer = await Photographer.findById(photographerId);

    if (!photographer || !photographer.available) {
      return res.status(400).json({
        message: "Photographer not available",
      });
    }

    const booking = await Booking.create({
      customer: req.user.id,
      photographer: photographerId,
      serviceTitle,
      servicePrice,
      bookingDate,
      note,
    });

    res.status(201).json(booking);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Booking creation failed",
    });
  }
};


/**
 * PHOTOGRAPHER → VIEW BOOKINGS
 */
export const getPhotographerBookings = async (req, res) => {
  const photographer = await Photographer.findOne({ user: req.user.id });

  if (!photographer) {
    return res.status(404).json({ message: "Profile not found" });
  }

  const bookings = await Booking.find({
    photographer: photographer._id,
  })
    .populate("customer", "name email")
    .sort({ createdAt: -1 });

  res.json(bookings);
};


/**
 * PHOTOGRAPHER → ACCEPT / REJECT BOOKING
 */
export const updateBookingStatus = async (req, res) => {
  const { status } = req.body;
  const photographer = await Photographer.findOne({ user: req.user.id });
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    return res.status(404).json({ message: "Booking not found" });
  }

  // ❗ SECURITY CHECK
  if (booking.photographer.toString() !== photographer._id.toString()) {
    return res.status(403).json({ message: "Not authorized" });
  }

  booking.status = status;
  await booking.save();

  res.json(booking);
};

/**
 * CUSTOMER → BOOKING HISTORY
 */
export const getCustomerBookings = async (req, res) => {
  const bookings = await Booking.find({ customer: req.user.id })
    .populate("photographer", "name city coverImage")
    .sort({ createdAt: -1 });

  res.json(bookings);
};
