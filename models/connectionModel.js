import mongoose from "mongoose";
import bcrypt from "bcrypt";
const connectionSchema = new mongoose.Schema({
  refreshToken: {
    type: String,
    default: null,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    requried: true,
  },
  status: {
    type: String,
    enum: ["ACTIVE", "INACTIVE"],
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

export const Connection = mongoose.model("Connection", connectionSchema);
