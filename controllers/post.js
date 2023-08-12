const Post = require("../models/Post");
const User = require("../models/User");

exports.createPost = async (req, res) => {
  try {
    const post = await new Post(req.body).save();
    await post.populate("user", "company_Name picture cover username");

    res.json(post);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
// exports.getAllPosts = async (req, res) => {
//   try {
//     const posts = await Post.find()
//       .populate("user", "company_Name picture username Economic_Sector")
//       .sort({ createdAt: -1 }); // to the newest to the oldest the way post come
//     res.json(posts);
//   } catch (error) {
//     return res.status(500).json({ message: error.message });
//   }
// };
exports.getAllPosts = async (req, res) => {
  try {
    const followingTemp = await User.findById(req.user.id).select("following");
    const following = followingTemp.following;
    const economicSectorTemp = await User.findById(req.user.id).select(
      "Economic_Sector"
    );
    const userEconomicSector = economicSectorTemp.Economic_Sector;
    const users = await User.find({ Economic_Sector: userEconomicSector });

    const followingPosts = await Post.find({
      $or: [
        { user: { $in: users.map((user) => user.id) } }, // Filter by users with the same economic sector
        { user: { $in: following } },
        { user: { $eq: req.user._id } }, // Filter out posts of followed users and the logged-in user
      ],
    })
      .populate("user", "company_Name picture username cover Economic_Sector")
      .populate("comments.commentBy", "company_Name username picture")
      .sort({ createdAt: -1 })
      .limit(10);
    const followingPostsIds = followingPosts.map((post) => post._id);
    const remainingPosts = await Post.find({
      _id: { $nin: followingPostsIds }, // Filter out posts that are already fetched in the 'followingPosts'
    })
      .populate("user", "company_Name picture username cover Economic_Sector")
      .populate("comments.commentBy", "company_Name username picture")
      .sort({ createdAt: -1 })
      .limit(10);

    const allPosts = followingPosts.concat(remainingPosts).flat();
    allPosts.sort((a, b) => {
      return b.createdAt - a.createdAt;
    });
    res.json(allPosts);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.comment = async (req, res) => {
  try {
    const { comment, image, postId } = req.body;
    const post = await Post.findById(postId).populate("user");
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    await User.findByIdAndUpdate(post.user, {
      $push: {
        notificationComment: {
          type: "comment", // Add the type to differentiate between notifications
          user: req.user.id,
          createdAt: new Date(),
        },
      },
    });
    await User.findByIdAndUpdate(post.user, {
      $push: {
        notificationAll: req.user.id,
      },
    });
    let newComments = await Post.findByIdAndUpdate(
      postId,
      {
        $push: {
          comments: {
            comment: comment,
            image: image,
            commentBy: req.user.id,
            commentAt: new Date(),
          },
        },
      },
      {
        new: true,
      }
    ).populate("comments.commentBy", "picture company_Name username");
    res.json(newComments.comments);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.savePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const user = await User.findById(req.user.id);
    const check = user?.SavedPosts.find(
      (post) => post.post.toString() == postId
    );
    if (check) {
      await User.findByIdAndUpdate(req.user.id, {
        $pull: {
          SavedPosts: {
            _id: check._id,
          },
        },
      });
    } else {
      await User.findByIdAndUpdate(req.user.id, {
        $push: {
          SavedPosts: {
            post: postId,
            savedAt: new Date(),
          },
        },
      });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.deletePost = async (req, res) => {
  try {
    await Post.findByIdAndRemove(req.params.id);
    res.json({ status: "ok" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.visitorPosts = async (req, res) => {
  try {
    const visitorPosts = await Post.find()
      .populate("user", "company_Name picture username cover Economic_Sector")
      .populate("comments.commentBy", "company_Name username picture")
      .sort({ createdAt: -1 })
      .limit(10);

    res.json(visitorPosts);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
