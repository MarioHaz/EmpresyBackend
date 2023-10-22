const Messages = require("../models/messageModel.js");
const User = require("../models/User.js");

exports.createMessage = async (data) => {
  let newMessage = await Messages.create(data);
  if (!newMessage) {
    res.status(400);
  } else {
    return newMessage;
  }
};

exports.populateMessage = async (id) => {
  let msg = await Messages.findById(id)
    .populate({
      path: "sender",
      select: "company_Name picture",
      model: "User",
    })
    .populate({
      path: "conversation",
      select: "name picture isGropu users",
      model: "Conversation",
      populate: {
        path: "users",
        select: "company_Name email picture",
        model: "User",
      },
    });
  if (!msg) {
    res.status(400);
  } else {
    return msg;
  }
};

exports.getConvoMessages = async (convo_id) => {
  const messages = await Messages.find({ conversation: convo_id })
    .populate("sender", "company_Name picture email")
    .populate("conversation");
  if (!messages) {
    res.status(400);
  } else {
    return messages;
  }
};
