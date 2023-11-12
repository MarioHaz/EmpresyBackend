const express = require("express");
const {
  createPost,
  getAllPosts,
  comment,
  savePost,
  deletePost,
  visitorPosts,
  getSavedPosts,
  getOrderedPosts,
  getOrderedVisitorPosts,
} = require("../controllers/post");
const { authUser } = require("../middlewares/auth");

const router = express.Router();

router.post("/createPost", authUser, createPost);

router.get("/getAllPosts", authUser, getAllPosts);
router.get("/getOrderedPosts", authUser, getOrderedPosts);
router.get("/getOrderedVisitorPosts", getOrderedVisitorPosts);
router.put("/comment", authUser, comment);
router.put("/savePost/:id", authUser, savePost);
router.delete("/deletePost/:id", authUser, deletePost);
router.get("/visitorPosts", visitorPosts);
router.get("/getSavedPosts", authUser, getSavedPosts);

module.exports = router;
