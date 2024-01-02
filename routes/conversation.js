const express = require("express");
const {
  create_open_conversation,
  getConversation,
  searchUserMessenger,
  removeConversation,
} = require("../controllers/conversation");
const { authUser } = require("../middlewares/auth");

const router = express.Router();

router.post("/conversation", authUser, create_open_conversation);
router.get("/getConversation", authUser, getConversation);
router.get("/searchUserMessenger", authUser, searchUserMessenger);
router.delete("/removeConversation/:id", authUser, removeConversation);

module.exports = router;
