import express from "express";
import auth from "../middleware/authMiddleware.js";
import Review from "../models/review.js";

const router = express.Router();

router.post("/", auth, async (req, res) => {
  const { flat_id, rating, comment } = req.body;
  const review = await Review.create({ flat_id, user_id: req.user.id, rating, comment });
  res.json(review);
});

router.get("/:flat_id", async (req, res) => {
  const reviews = await Review.find({ flat_id: req.params.flat_id }).populate("user_id", "name");
  res.json(reviews);
});

export default router;
