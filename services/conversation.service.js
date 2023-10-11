const ConversationModel = require("../models/ConversationModel.js");
const User = require("../models/User");

exports.doesConversationExisits = async (sender_id, receiver_id) => {
  let convos = await ConversationModel.find({
    isGroup: false,
    $and: [
      { users: { $elemMatch: { $eq: sender_id } } },
      { users: { $elemMatch: { $eq: sender_id } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  if (!convos) {
    res.status(400);
  }
  console.log("Latest Message:", convos[0].latestMessage);
  // populate message model
  convos = await User.populate(convos, {
    path: "latestMessage.sender",
    select: "company_Name email picture",
  });

  console.log(convos[0]);
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
  console.log(msg);
  const updatedConvo = await ConversationModel.findByIdAndUpdate(convo_id, {
    latestMessage: msg,
  });
  console.log(updatedConvo);
  if (!updatedConvo) {
    res.status(400);
  } else {
    return updatedConvo;
  }
};
