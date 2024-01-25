const Post = require("../models/Post");
const React = require("../models/React");
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
exports.getOrderedPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("user", "company_Name picture username Economic_Sector")
      .sort({ createdAt: -1 }); // to the newest to the oldest the way post come
    res.json(posts);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
exports.getOrderedVisitorPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("user", "company_Name picture username Economic_Sector")
      .sort({ createdAt: -1 }); // to the newest to the oldest the way post come
    res.json(posts);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
exports.getAllPosts = async (req, res) => {
  try {
    const countPosts = async () => {
      try {
        const postCount = await Post.countDocuments();
        return postCount;
      } catch (error) {
        console.error("Error counting posts:", error);
        throw error;
      }
    };

    const totalPostCount = await countPosts();

    const visitorPosts = await Post.aggregate([
      { $sample: { size: totalPostCount } }, // Set the sample size to the total post count
      {
        $lookup: {
          from: "users", // Assuming the user data is stored in a collection named "users"
          localField: "user",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
    ]);

    res.json(visitorPosts);
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
      res.json("unsaved");
    } else {
      await User.findByIdAndUpdate(req.user.id, {
        $push: {
          SavedPosts: {
            post: postId,
            savedAt: new Date(),
          },
        },
      });
      res.json("saved");
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
    const totalPosts = await Post.countDocuments();

    const newPosts = await Post.find()
      .populate("user", "company_Name picture username Economic_Sector")
      .sort({ createdAt: -1 }); // to the newest to the oldest the way post come
    const posts = await Post.aggregate([
      { $sample: { size: totalPosts } }, // Adjust the size according to your requirements

      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
    ]);

    const interleavedPosts = [];
    let i = 0;
    let j = 0;

    while (j < posts.length) {
      // Push 3 random posts
      for (let k = 0; k < 3 && j < posts.length; k++) {
        interleavedPosts.push(posts[j]);
        j++;
      }

      // Push 1 new post
      if (i < newPosts.length) {
        interleavedPosts.push(newPosts[i]);
        i++;
      }
    }

    // If there are remaining new posts, append them
    while (i < newPosts.length) {
      interleavedPosts.push(newPosts[i]);
      i++;
    }

    res.json(interleavedPosts);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// exports.visitorPosts = async (req, res) => {
//   try {
//     const countPosts = async (query) => {
//       try {
//         const postCount = await Post.countDocuments(query);
//         return postCount;
//       } catch (error) {
//         console.error("Error counting posts:", error);
//         throw error;
//       }
//     };

//     const allPosts = [];
//     let currentDate = new Date();

//     // Loop until there are no more posts
//     while (true) {
//       const currentQuery = {
//         createdAt: {
//           $gte: new Date(currentDate - 10 * 24 * 60 * 60 * 1000),
//           $lt: new Date(currentDate),
//         },
//       };

//       const totalCurrentCount = await countPosts(currentQuery);

//       if (totalCurrentCount === 0) {
//         // No more posts for the current interval
//         break;
//       }

//       const currentPosts = await Post.aggregate([
//         { $match: currentQuery },
//         { $sample: { size: totalCurrentCount } },
//         {
//           $lookup: {
//             from: "users",
//             localField: "user",
//             foreignField: "_id",
//             as: "user",
//           },
//         },
//         { $unwind: "$user" },
//       ]);

//       allPosts.push(...currentPosts);

//       // Update the current date for the next iteration
//       currentDate = new Date(currentDate - 10 * 24 * 60 * 60 * 1000);
//     }

//     res.json(allPosts);
//   } catch (error) {
//     return res.status(500).json({ message: error.message });
//   }
// };

exports.getSavedPosts = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const checkSaved = user?.SavedPosts.map((x) => x.post.toString());

    const savedPosts = await Post.find({ _id: { $in: checkSaved } })
      .populate("user", "company_Name picture username cover Economic_Sector")
      .sort({ createdAt: -1 });

    res.json(savedPosts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getSavedPostsMovil = async (req, res) => {
  try {
    const user = await User.findById(req.query.idUser);
    const checkSaved = user?.SavedPosts.map((x) => x.post.toString());

    const savedPosts = await Post.find({ _id: { $in: checkSaved } })
      .populate("user", "company_Name picture username cover Economic_Sector")
      .sort({ createdAt: -1 });

    res.json(savedPosts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUserPosts = async (req, res) => {
  try {
    const id = req.query.idUser;

    // Assuming Post model has a field 'user' which stores the user's ID
    const userPosts = await Post.find({ user: id })
      .populate("user", "company_Name picture username cover Economic_Sector")
      .sort({ createdAt: -1 });

    res.json(userPosts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getPost = async (req, res) => {
  try {
    const postId = req.params.id;

    const posts = await Post.findById(postId).populate(
      "user",
      "company_Name picture username cover"
    );

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
