const ConversationModel = require("../models/ConversationModel.js");
const User = require("../models/User");

exports.doesConversationExisits = async (sender_id, receiver_id) => {
  let convos = await ConversationModel.find({
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
  const newConvo = await ConversationModel.create(data);
  if (!newConvo) {
  } else {
    return newConvo;
  }
};

exports.populateConversation = async (id, fieldsToPopulate, fieldsToRemove) => {
  const populatedConvo = await ConversationModel.findOne({
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
  await ConversationModel.find({
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
  const updatedConvo = await ConversationModel.findByIdAndUpdate(convo_id, {
    latestMessage: msg,
  });

  if (!updatedConvo) {
    res.status(400);
  } else {
    return updatedConvo;
  }
};

exports.searchUsers = async (keyword) => {
  const users = await User.find({
    $or: [
      { company_Name: { $regex: keyword, $options: "i" } },
      { "details.bio": { $regex: keyword, $options: "i" } },
    ],
  });
  return users;
};
