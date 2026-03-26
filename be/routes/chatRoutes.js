import express from "express";
import auth from "../middleware/authMiddleware.js";
import Message from "../models/message.js";

const router = express.Router();

router.post("/", auth, async (req, res) => {
  const { receiver_id, text } = req.body;
  const message = await Message.create({ sender_id: req.user.id, receiver_id, text });
  res.json(message);
});

router.get("/:receiver_id", auth, async (req, res) => {
  const { receiver_id } = req.params;
  const messages = await Message.find({
    $or: [
      { sender_id: req.user.id, receiver_id },
      { sender_id: receiver_id, receiver_id: req.user.id },
    ],
  }).sort("createdAt");
  res.json(messages);
});

export default router;
