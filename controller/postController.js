import { Comments } from "../models/commentsModel.js";
import { Likes } from "../models/likeModel.js";
import { Posts } from "../models/postModel.js";
import { uploadToCloudinary } from "../utils/fileUpload.js";

export const createPosts = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { caption, tagPeople, allowComment, sharePostWith } = req.body;
    const { url } = await uploadToCloudinary(req.file.buffer);

    if (!url) {
      throw new Error("Image upload failed");
    }

    const posts = await Posts.create({
      caption,
      userId,
      imgUrl: url,
      tagPeople,
      allowComment,
      sharePostWith,
    });

    if (!posts) {
      throw new Error("Unable to create posts");
    }
    res
      .status(201)
      .json({ success: true, message: "Post created Successfull" });
  } catch (error) {
    next(error);
  }
};

export const likePost = async (req, res, next) => {
  const { postId } = req.params;
  const userId = req.userId;

  const existing = await Likes.findone({
    userId,
    postId,
  });

  if (existing) {
    await Likes.deleteOne({ _id: existing._id });
    const updatePost = await Posts.findByIdAndDelete(
      postId,
      {
        $inc: { likeCount: -1 },
      },
      { new: true },
    );

    return res
      .status(200)
      .json({ success: true, unliked: true, likeCount: updatePost.likeCount });
  }

  await Likes.create({ postId, userId });
  const updatePost = await Posts.findByIdAndDelete(
    postId,
    {
      $inc: { likeCount: 1 },
    },
    { new: true },
  );

  res
    .status(200)
    .json({ success: true, liked: true, likeCount: updatePost.likeCount });
};

export const commentPost = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const userId = req.userId;
    const { comment, parentComment } = req.body;
    if (parentComment) {
      const findComment = await Comments.findOne({
        _id: parentComment,
        post: postId,
      });

      if (!findComment) {
        return res
          .json(404)
          .json({ success: false, message: "parent comment not found" });
      }
    }
    const newComment = await Comments.create({
      comment,
      userId,
      post: postId,
      parentComment: parentComment || null,
    });

    return res
      .status(201)
      .json({ success: true, message: "reply saved", comment: newComment });
  } catch (error) {
    console.error(error);
  }
};
