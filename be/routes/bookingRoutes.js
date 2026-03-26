import express from "express";
import auth from "../middleware/authMiddleware.js";
import Booking from "../models/booking.js";
import Flat from "../models/flat.js";

const router = express.Router();

router.post("/", auth, async (req, res) => {
  const { flat_id } = req.body;
  const existing = await Booking.findOne({ flat_id, tenant_id: req.user.id });
  if (existing) return res.status(400).json({ message: "Already booked" });
  const booking = await Booking.create({ flat_id, tenant_id: req.user.id });
  res.json(booking);
});

router.get("/my", auth, async (req, res) => {
  const bookings = await Booking.find({ tenant_id: req.user.id }).populate("flat_id");
  res.json(bookings);
});

router.get("/owner", auth, async (req, res) => {
  const flats = await Flat.find({ owner_id: req.user.id });
  const flatIds = flats.map((f) => f._id);
  const bookings = await Booking.find({ flat_id: { $in: flatIds } })
    .populate("flat_id")
    .populate("tenant_id", "name email");
  res.json(bookings);
});

router.put("/:id", auth, async (req, res) => {
  const booking = await Booking.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true }
  );
  res.json(booking);
});

export default router;
