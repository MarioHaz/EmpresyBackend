const mongoose = require("mongoose");

const { ObjectId } = mongoose.Schema;

const userSchema = mongoose.Schema(
  {
    company_Name: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
      text: true,
    },
    username: {
      type: String,

      trim: true,
      text: true,
      unique: true,
    },
    email: {
      type: String,
      required: [true, "e-mail is required"],
      trim: true,
      text: true,
    },
    phone_number: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
      text: true,
    },
    password: {
      type: String,
      required: [true, "password is required"],
    },
    picture: {
      type: String,
      trim: true,
      default:
        "https://res.cloudinary.com/demo/image/upload/d_avatar.png/non_existing_id.png",
    },
    cover: {
      type: String,
      trim: true,
    },
    Economic_Sector: {
      type: String,
      required: [true, "Economic Sector is required"],
      trim: true,
      text: true,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    friends: [
      {
        type: ObjectId,
        ref: "User",
      },
    ],

    following: [
      {
        type: ObjectId,
        ref: "User",
      },
    ],
    notificationFollowing: [
      {
        type: ObjectId,
        ref: "User",
      },
    ],
    notificationComment: [
      {
        type: ObjectId,
        ref: "User",
      },
    ],
    notificationAll: [
      {
        type: ObjectId,
        ref: "User",
      },
    ],
    followers: [
      {
        type: ObjectId,
        ref: "User",
      },
    ],
    notifications: [
      {
        type: ObjectId,
        ref: "User",
      },
    ],
    requests: [
      {
        type: ObjectId,
        ref: "User",
      },
    ],
    search: [
      {
        user: {
          type: ObjectId,
          ref: "User",
          required: true,
        },
        createdAt: {
          type: Date,
          required: true,
        },
      },
    ],
    details: {
      bio: {
        type: String,
        text: true,
      },

      webpage: {
        type: String,
      },

      Economic_Sector: {
        type: String,
        text: true,
      },

      currentCity: {
        type: String,
        text: true,
      },
    },
    SavedPosts: [
      {
        post: {
          type: ObjectId,
          ref: "Post",
        },
        savedAt: {
          type: Date,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("User", userSchema);
