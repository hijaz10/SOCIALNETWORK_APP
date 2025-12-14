import Post from "../models/posts.js";
import redis from "../configs/redis.js";


export const createPost = async (req, res) => {
  try {
    const { caption, image } = req.body;
    const author = req.userId; 

    const newPost = await Post.create({
      author,
      caption,
      image: image || "",
    });

    res.status(201).json({
      message: "Post created successfully",
      post: newPost,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const cachedFeed = await redis.get("feed:global");

    if (cachedFeed) {
      return res.json({
        source: "cache",
        posts: JSON.parse(cachedFeed),
      });
    }

    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .limit(50)
      .populate("author", "username fullname");

    // TTL: 5 minutes
    await redis.set("feed:global", JSON.stringify(posts), { EX: 300 });

    return res.json({
      source: "database",
      posts,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




export const getPost = async (req, res) => {
  try {
    const postId = req.params.id;

    const cacheKey = `post:${postId}`;

    const cachedPost = await redis.get(cacheKey);
    if (cachedPost) {
      console.log("Returning post from cache");
      return res.json(JSON.parse(cachedPost));
    }

    const post = await Post.findById(postId).populate(
      "author",
      "username fullname"
    );

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    await redis.set(cacheKey, JSON.stringify(post), {
      EX: 60 * 5, // 5 minutes
    });

    console.log(" Post stored in cache");

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};





export const updatePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const { caption, image } = req.body;
    const userId = req.userId;

    const post = await Post.findById(postId);

    if (!post) return res.status(404).json({ message: "Post not found" });


    if (post.author.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "You are not allowed to edit this post" });
    }

    if (caption){
        post.caption = caption;
    } 
    if (image){
        post.image = image;
    } 

    await post.save();

    res.json({ message: "Post updated successfully", post });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



export const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.userId;

    const post = await Post.findById(postId);

    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.author.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "You are not allowed to delete this post" });
    }

    await post.deleteOne();

    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
