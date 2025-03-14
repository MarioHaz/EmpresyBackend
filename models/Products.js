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
    product_name: {
      type: "string",
      required: true,
    },
    images: {
      type: Array,
      required: true,
    },
    brand: { type: "string" },
    property: { type: "string" },
    category: { type: "string", required: true },
    Economic_Sector: { type: "string" },
    description: { type: "string", required: true },
    date: { type: "string" },
    eventLocation: { type: "string" },
    // reviews: [reviewSchema],
    rating: { type: "number", default: 0 },
    numReviews: { type: "number", default: 0 },
    price: { type: "number", default: 0 },
    countInStock: { type: "number", default: 0 },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Products", productSchema);
