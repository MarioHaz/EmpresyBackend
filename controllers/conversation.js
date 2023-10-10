const User = require("../models/User");
const Conversation = require("../models/ConversationModel");
const {
  doesConversationExisits,
  createConversation,
  populateConversation,
  getUserConversations,
} = require("../services/conversation.service");

exports.create_open_conversation = async (req, res) => {
  try {
    const sender_id = req.user.id;
    const { receiver_id } = req.body;
    //check if receiver_id is provide
    if (!receiver_id) {
      return res.status(400).json({ message: "Invalid receiver" });
    }
    // check if chat exist
    const existed_conversation = await doesConversationExisits(
      sender_id,
      receiver_id
    );
    if (existed_conversation) {
      res.json(existed_conversation);
    } else {
      let receiver_user = await User.findById(receiver_id);
      let convoData = {
        name: receiver_user.company_Name,
        picture: receiver_user.picture,
        isGroup: false,
        users: [sender_id, receiver_id],
      };
      const newConvo = await createConversation(convoData);
      const populatedConvo = await populateConversation(
        newConvo._id,
        "users",
        "-password"
      );
      res.status(200).json(populatedConvo);
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.getConversation = async (req, res) => {
  try {
    const user_id = req.user.id;
    let conversations;
    await Conversation.findById(user_id)
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
      });

    if (!conversations) {
      res.send("No conversations");
    } else {
      return res.status(200).json(conversations);
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
