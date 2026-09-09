import { Followers } from "../models/followerModel";
import { Posts } from "../models/postModel";
export const validateFollower = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const requestUser = req.userId;

    const post = await Posts.findById(postId);
    if (String(requestUser) === String(post.userId)) {
      next();
    }
    if (!post) {
      throw new Error("Post not found");
    }
    const follower = await Followers.findOne({
      follower: requestUser,
      following: post.userId,
    });

    if (!follower) {
      return res.status(403).json({
        message: "You must follow this user to interact with their posts",
      });
    }
    next();
  } catch (error) {
    next(error);
  }
};

// later we would need to implement the close_friends feature currently we will go with the default behaviour
