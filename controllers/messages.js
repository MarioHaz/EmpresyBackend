const User = require("../models/User");
const messageModel = require("../models/messageModel");
const { updateLatestMessage } = require("../services/conversation.service");
const { populateMessage } = require("../services/message.service");
const {
  createMessage,
  getConvoMessages,
} = require("../services/message.service");

exports.sendMessage = async (req, res) => {
  try {
    const user_id = req.user.id;

    const { message, convo_id, files } = req.body;

    if (!convo_id || (!message && !files)) {
      console.log("error provide conversation id and message body");
      return res.sendStatus(400);
    }
    const msgData = {
      sender: user_id,
      message,
      conversation: convo_id,
      files: files || [],
    };
    let newMessage = await createMessage(msgData);
    let populateMessages = await populateMessage(newMessage._id);
    await updateLatestMessage(convo_id, newMessage);
    res.json(populateMessages);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const convo_id = req.params.convo_id;
    if (!convo_id) {
      return res.sendStatus(400);
    }

    const messages = await getConvoMessages(convo_id);

    res.json(messages);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
