const Conversation = require("../models/ConversationModel.js");
const User = require("../models/User");

exports.doesConversationExisits = async (sender_id, receiver_id) => {
  let convos = await Conversation.find({
    isGroup: false,
    $and: [
      { users: { $elemMatch: { $eq: sender_id } } },
      { users: { $elemMatch: { $eq: receiver_id } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");
  if (!convos) {
    res.status(400);
  }

  // populate message model
  convos = await User.populate(convos, {
    path: "latestMessage.sender",
    select: "company_Name email picture",
  });

  return convos[0];
};

exports.createConversation = async (data) => {
  const newConvo = await Conversation.create(data);
  if (!newConvo) {
  } else {
    return newConvo;
  }
};

exports.populateConversation = async (id, fieldsToPopulate, fieldsToRemove) => {
  const populatedConvo = await Conversation.findOne({
    _id: id,
  }).populate(fieldsToPopulate, fieldsToRemove);
  if (!populatedConvo) {
    res.status(400);
  } else {
    return populatedConvo;
  }
};

exports.getUserConversations = async (user_id) => {
  let conversations;
  await Conversation.find({
    users: { $elemMatch: { $eq: user_id } },
  })
    .populate("users", "-password")
    .populate("admin", "-password")
    .populate("latestMessage")
    .sort({ updatedAt: -1 })
    .then(async (results) => {
      results = await User.populate(results, {
        path: "latestMessage.sender",
        select: "company_Name email picture",
      });
      conversations = results;
    })
    .catch((err) => {
      res.status(400);
    });
  return conversations;
};

exports.updateLatestMessage = async (convo_id, msg) => {
  const updatedConvo = await Conversation.findByIdAndUpdate(convo_id, {
    lastesMessage: msg,
  });
  if (!updatedConvo) {
    res.status(400);
  } else {
    return updatedConvo;
  }
};
