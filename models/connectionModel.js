import mongoose from "mongoose";
import bcrypt from "bcrypt";
const connectionSchema = new mongoose.Schema({
  refreshToken: {
    type: String,
    default: "",
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    requried: true,
  },
  status: {
    type: String,
    default: ["INACTIVE", "ACTIVE"],
  },
});

export const Connection = mongoose.model("Connection", connectionSchema);
