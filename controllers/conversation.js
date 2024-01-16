const User = require("../models/User");
const Conversation = require("../models/ConversationModel");
const {
  doesConversationExisits,
  createConversation,
  populateConversation,
  getUserConversations,
  searchUsers,
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
      //let receiver_user = await User.findById(receiver_id);
      let convoData = {
        name: "receiver_user.company_Name",
        picture: " receiver_user.picture",
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
    const conversations = await getUserConversations(user_id);
    res.status(200).json(conversations);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.searchUserMessenger = async (req, res) => {
  try {
    const keyword = req.query.search;
    if (!keyword) {
      return res.status(500).json({ message: error.message });
    }
    const users = await searchUsers(keyword, req.user.id);

    res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.removeConversation = async (req, res) => {
  try {
    const conversationId = req.params.id; // Assuming the conversation ID is passed in the request params

    const conversation = await Conversation.findByIdAndRemove(conversationId);
    console.log(conversation);

    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    res.status(200).json({ message: "Conversation removed successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
