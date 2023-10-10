const mongoose = require("mongoose");

const { ObjectId } = mongoose.Schema.Types;
const conversationSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Cconversation is required"],
      trim: true,
    },

    picture: {
      type: String,
      required: true,
    },

    idGroup: {
      type: Boolean,
      required: true,
      default: false,
    },

    users: [{ type: ObjectId, ref: "User" }],
    latestMessage: {
      type: ObjectId,
      ref: "Messages",
    },

    admin: {
      type: ObjectId,
      ref: "User",
    },
  },
  {
    collection: "Conversations",
    timestamps: true,
  }
);

module.exports = mongoose.model("Conversation", conversationSchema);
