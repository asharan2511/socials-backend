import mongoose from "mongoose";
import { addPostsValidation } from "../utils/validation.js";

const postSchema = new mongoose.Schema(
  {
    caption: {
      type: String,
      default: "",
    },
    imgUrl: {
      type: String,
      default: "",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    tagPeople: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    allowComment: {
      type: Boolean,
      default: true,
    },
    sharePostWith: {
      type: String,
      enum: ["FOLLOWERS", "CLOSE_FRIENDS"],
      default: "FOLLOWERS",
    },
    likeCount: {
      type: Number,
      default: 0,
    },
    shareCount: {
      type: Number,
      default: 0,
    },
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
  },
  { timestamps: true },
);

postSchema.pre("save", function () {
  const verificationResult = addPostsValidation.safeParse({
    caption: this.caption,
    imgUrl: this.imgUrl,
    tagPeople: this.tagPeople,
    allowComment: this.allowComment,
    sharePostWith: this.sharePostWith,
    comments: this.comments,
  });

  if (!verificationResult) {
    throw new Error("Validation failed");
  }

  return;
});

export const Posts = mongoose.model("Posts", postSchema);
