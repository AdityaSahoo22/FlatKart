import mongoose from "mongoose";

const ownerSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, default: "owner" },
  otp: String,
  otpExpiry: Date,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Owner", ownerSchema);
