const express = require("express");
const {
  sendMessage,
  getMessages,
  deleteMessage,
} = require("../controllers/messages");
const { authUser } = require("../middlewares/auth");

const router = express.Router();
router.post("/messages/sendMessage", authUser, sendMessage);
router.get("/messages/getMessages/:convo_id", authUser, getMessages);
router.delete("/deleteMessage/:messageId", authUser, deleteMessage);

module.exports = router;
