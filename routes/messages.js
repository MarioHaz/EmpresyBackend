const express = require("express");
const { sendMessage, getMessages } = require("../controllers/messages");
const { authUser } = require("../middlewares/auth");

const router = express.Router();
router.post("/messages/sendMessage", authUser, sendMessage);
router.get("/messages/getMessages/:convo_id", authUser, getMessages);

module.exports = router;
