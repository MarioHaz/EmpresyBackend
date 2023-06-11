const Post = require("../models/Post");

exports.createPost = async (req, res) => {
  try {
    const post = await new Post(req.body).save();
    res.json(post);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("user", "company_Name picture username Economic_Sector")
      .sort({ createdAt: -1 }); // to the newest to the oldest the way post come
    res.json(posts);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
