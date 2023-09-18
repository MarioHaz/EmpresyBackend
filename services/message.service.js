const messageModel = require("../models/messageModel.js");
const User = require("../models/User.js");

exports.createMessage = async (data) => {
  let newMessage = await messageModel.create(data);
  if (!newMessage) {
    res.status(400);
  } else {
    return newMessage;
  }
};

exports.populateMessage = async (id) => {
  let msg = await messageModel
    .findById(id)
    .populate({
      path: "sender",
      select: "company_Name picture",
      model: "User",
    })
    .popultae({
      path: "conversation",
      select: "company_Name isGropu users",
      model: "ConversationModel",
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
  const messages = await messageModel
    .find({ conversation: convo_id })
    .populate("sender", "name picture emial")
    .populate("conversation");
  if (!messages) {
    res.status(400);
  } else {
    return messages;
  }
};
