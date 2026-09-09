import mongoose from "mongoose";
import { followRequestSchemaValidation } from "../utils/validation";

const followRequestSchema = new mongoose.Schema(
  {
    requestUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    recepient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["PENDING", "ACCEPTED", "REJECTED"],
      default: "PENDING",
    },
  },
  { timestamps: true },
);

followRequestSchema.index({ requestUser: 1, recepient: 1 }, { unique: true });
followRequestSchema.index({ recepient: 1 });

export const FollowRequest = mongoose.model(
  "FollowRequest",
  followRequestSchema,
);
