import express from "express";
import { searchFlats } from "../controllers/flatController.js";
import auth from "../middleware/authMiddleware.js";
import Flat from "../models/flat.js";

const router = express.Router();

router.get("/search", searchFlats);

router.get("/mine", auth, async (req, res) => {
  const flats = await Flat.find({ owner_id: req.user.id });
  res.json(flats);
});

router.get("/:id", async (req, res) => {
  const flat = await Flat.findById(req.params.id);
  if (!flat) return res.status(404).json({ message: "Flat not found" });
  res.json(flat);
});

router.post("/", auth, async (req, res) => {
  const { location, price, type, description } = req.body;
  const flat = await Flat.create({ owner_id: req.user.id, location, price, type, description });
  res.json(flat);
});

router.delete("/:id", auth, async (req, res) => {
  await Flat.findOneAndDelete({ _id: req.params.id, owner_id: req.user.id });
  res.json({ message: "Deleted" });
});

export default router;
