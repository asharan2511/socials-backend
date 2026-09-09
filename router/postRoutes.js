import express from "express";
import { authentication } from "../utils/auth.js";
import { createPosts, likePost } from "../controller/postController.js";
import { upload } from "../utils/fileUpload.js";
import { validateFollower } from "../utils/validateFollower.js";
const postRouter = express.Router();

postRouter
  .post("/:userId/addpost", authentication, upload.single("image"), createPosts)
  .post("/:postId/like-post", authentication, validateFollower, likePost);

export default postRouter;
