const User = require("../models/User");
const Messages = require("../models/messageModel.js");
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

exports.deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const data = await Messages.findById(messageId);
    const convo_id = data.conversation;
    const premessages = await getConvoMessages(convo_id);
    await Messages.findByIdAndRemove(messageId);
    const posmessages = await getConvoMessages(convo_id);

    // Check if the deleted message was the last message
    const isLastMessage =
      premessages[premessages.length - 1]._id.toString() === messageId;

    // Update latestMessage if the deleted message was the last one
    if (isLastMessage && posmessages.length > 0) {
      const newLatestMessage = posmessages[posmessages.length - 1]._id;
      // Update the conversation's latestMessage using the updateLatestMessage function
      await updateLatestMessage(convo_id, newLatestMessage);
    }

    res.json({ status: "ok", data });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
