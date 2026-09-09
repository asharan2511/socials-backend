import mongoose from "mongoose";
import { followerValidation } from "../utils/validation";

const followSchema = new mongoose.Schema(
  {
    follower: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    following: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

//to prevent duplicate requests

followSchema.index({ follower: 1, following: 1 }, { unique: true });
followSchema.index({ follower: 1 });
followSchema.index({ following: 1 });

followSchema.pre("save", function () {
  const validateResult = followerValidation.safeParse({
    follower: this.follower,
    following: this.following,
  });

  if (!validateResult.success) {
    throw new Error("Validation failed");
  }
});

export const Followers = mongoose.model("Follower", followSchema);
