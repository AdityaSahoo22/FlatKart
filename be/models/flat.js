import mongoose from "mongoose";

const flatSchema = new mongoose.Schema({
  owner_id: String,
  location: String,
  price: Number,
  type: String,
  description: String,
});

export default mongoose.model("Flat", flatSchema);
