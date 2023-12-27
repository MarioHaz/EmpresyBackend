const React = require("../models/React");
const User = require("../models/User");
const Post = require("../models/Post");
const mongoose = require("mongoose");

exports.reactPost = async (req, res) => {
  try {
    const reactBy = req.user.id;

    const { postId, react } = req.body;

    const check = await React.findOne({
      postRef: postId,
      reactBy: req.user.id,
    });

    const post = await Post.findById(postId);

    if (check == null) {
      const newReact = new React({
        react: react,
        postRef: postId,
        reactBy: req.user.id,
      });

      await newReact.save();

      await User.findByIdAndUpdate(post.user, {
        $push: {
          notificationReact: {
            type: "react", // Add the type to differentiate between notifications
            user: req.user.id,
            createdAt: new Date(),
            postRef: postId,
          },
        },
      });
      await User.findByIdAndUpdate(post.user, {
        $push: {
          notificationAll: req.user.id,
        },
      });
      res.json("added");
    } else {
      if (check.react == react) {
        await React.findByIdAndRemove(check._id);
        res.json("removed");
      } else {
        await React.findByIdAndUpdate(check._id, {
          react: react,
        });
      }
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.getReacts = async (req, res) => {
  try {
    const reactsArray = await React.find({ postRef: req.params.id });

    const newReacts = reactsArray.reduce((group, react) => {
      let key = react["react"];
      group[key] = group[key] || [];
      group[key].push(react);
      return group;
    }, {});
    const reacts = [
      {
        react: "like",
        count: newReacts.like ? newReacts.like.length : 0,
      },
      {
        react: "love",
        count: newReacts.love ? newReacts.love.length : 0,
      },
      {
        react: "haha",
        count: newReacts.haha ? newReacts.haha.length : 0,
      },
      {
        react: "sad",
        count: newReacts.sad ? newReacts.sad.length : 0,
      },
      {
        react: "wow",
        count: newReacts.wow ? newReacts.wow.length : 0,
      },
      {
        react: "angry",
        count: newReacts.angry ? newReacts.angry.length : 0,
      },
    ];

    const check = await React.findOne({
      postRef: req.params.id,
      reactBy: req.user.id,
    });
    const user = await User.findById(req.user.id);
    const checkSaved = user?.SavedPosts.find(
      (x) => x.post.toString() === req.params.id
    );
    res.json({
      reacts,
      check: check?.react,
      total: reactsArray.length,
      checkSaved: checkSaved ? true : false,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
