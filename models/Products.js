const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const reviewSchema = mongoose.Schema(
  {
    user: {
      type: ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const productSchema = new mongoose.Schema(
  {
    user: {
      type: ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: "string",
      required: true,
    },
    image: { type: "string", required: true },
    brand: { type: "string" },
    category: { type: "string", required: true },
    description: { type: "string", required: true },
    // reviews: [reviewSchema],
    rating: { type: "number", default: 0 },
    numReviews: { type: "number", default: 0 },
    price: { type: "number", default: 0, required: true },
    countInStock: { type: "number", default: 0 },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Products", productSchema);
