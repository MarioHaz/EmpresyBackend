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
    },
    verified: {
      type: Boolean,
      default: false,
    },
    friends: {
      type: Array,
      default: [],
    },

    following: {
      type: Array,
      default: [],
    },
    followers: {
      type: Array,
      default: [],
    },
    requests: {
      type: Array,
      default: [],
    },
    search: [
      {
        user: {
          type: ObjectId,
          ref: "User",
        },
      },
    ],
    details: {
      bio: {
        type: String,
      },

      webpage: {
        type: String,
      },

      Economic_Sector: {
        type: String,
      },

      currentCity: {
        type: String,
      },
    },
    SavedPosts: [
      {
        post: {
          type: ObjectId,
          ref: "Post",
        },
        saveAt: {
          type: Date,
          default: new Date(),
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("User", userSchema);
