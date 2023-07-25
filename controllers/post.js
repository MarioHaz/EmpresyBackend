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
    console.log(allPosts);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.comment = async (req, res) => {
  try {
    const { comment, image, postId } = req.body;
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
