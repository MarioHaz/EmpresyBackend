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
  getUserPosts,
  getSavedPostsMovil,
  getPost,
  getSelectedEconomicPost,
  getSelectedEconomicPostVisitor,
} = require("../controllers/post");
const { authUser } = require("../middlewares/auth");

const router = express.Router();

router.post("/createPost", authUser, createPost);

router.get("/getAllPosts", authUser, getAllPosts);
router.post("/getSelectedEconomicPost", authUser, getSelectedEconomicPost);
router.get("/getOrderedPosts", authUser, getOrderedPosts);
router.get("/getOrderedVisitorPosts", getOrderedVisitorPosts);
router.put("/comment", authUser, comment);
router.put("/savePost/:id", authUser, savePost);
router.delete("/deletePost/:id", authUser, deletePost);
router.get("/visitorPosts", visitorPosts);
router.get("/getSavedPosts", authUser, getSavedPosts);
router.get("/getSavedPostsMovil", authUser, getSavedPostsMovil);
router.get("/getUserPosts", authUser, getUserPosts);
router.put("/getPost/:id", authUser, getPost);
router.post("/getSelectedEconomicPostVisitor", getSelectedEconomicPostVisitor);

module.exports = router;
