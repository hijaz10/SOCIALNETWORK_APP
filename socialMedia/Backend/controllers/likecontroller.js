import Like from "../models/likes.js";
import Post from "../models/posts.js";

export const likePost = async (req, res) => {
  try {
    const { postId } = req.body;
    const userId = req.user._id; 

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const existingLike = await Like.findOne({ postId, userId });
    if (existingLike) {
      return res.status(400).json({ message: "You already liked this post" });
    }

    const newLike = await Like.create({ postId, userId });

    res.status(201).json({
      message: "Post liked successfully",
      like: newLike,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const unlikePost = async (req, res) => {
  try {
    const { postId } = req.body;
    const userId = req.user._id;

    const like = await Like.findOne({ postId, userId });
    if (!like) {
      return res.status(404).json({ message: "You have not liked this post" });
    }

    await like.deleteOne();

    res.json({ message: "Like removed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getLikes = async (req, res) => {
  try {
    const postId = req.params.postId;

    const likesCount = await Like.countDocuments({ postId });

    res.json({ postId, likes: likesCount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
