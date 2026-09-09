import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    comment: {
      type: String,
      required: true,
      trim: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Posts",
      required: true,
    },
    parentComment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comments",
      default: null,
    },
    likeCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

commentSchema.index({ parentComment: 1 });
commentSchema.index({ post: 1, createdAt: -1 });
export const Comments = mongoose.model("Comments", commentSchema);
