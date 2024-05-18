const Product = require("../models/Products");
const User = require("../models/User");
const Post = require("../models/Post");
const Products = require("../models/Products");

exports.getAllProducts = async (req, res) => {
  try {
    const { items, page } = req.params;
    const pageSize = parseInt(items, 10); // Convert items to integer with base 10
    const pageNumber = parseInt(page, 10); // Convert page to integer with base 10
    const skip = (pageNumber - 1) * pageSize; // Calculate the number of documents to skip
    const totalProducts = await Product.countDocuments();
    const product = await Product.find()
      .populate("user", "company_Name picture username")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageSize); // to the newest to the oldest the way post come
    res.status(200).json({ totalProducts, product });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.getSector = async (req, res) => {
  try {
    const { sector, items, page } = req.params;
    const pageSize = parseInt(items, 10); // Convert items to integer with base 10
    const pageNumber = parseInt(page, 10); // Convert page to integer with base 10
    const skip = (pageNumber - 1) * pageSize; // Calculate the number of documents to skip

    const economicSectorUser = await User.find({
      Economic_Sector: sector,
    }).select("_id");

    const userIds = economicSectorUser.map((user) => user._id);

    const totalProducts = await Products.countDocuments({
      user: { $in: userIds },
      type: null,
    });

    const sectorProducts = await Products.aggregate([
      { $match: { user: { $in: userIds }, type: null } },
      { $skip: skip }, // Skip documents based on pagination
      { $limit: pageSize }, // Limit the number of documents returned
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
    ]);
    res.status(200).json({ totalProducts, sectorProducts });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.getProductsbyType = async (req, res) => {
  try {
    const type = req.params.type;
    const product = await Product.find({
      category: type,
    }).sort({
      createdAt: -1,
    }); // to the newest to the oldest the way post come

    res.json(product);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
exports.getMyProducts = async (req, res) => {
  try {
    const { items, page } = req.params;
    const pageSize = parseInt(items, 10); // Convert items to integer with base 10
    const pageNumber = parseInt(page, 10); // Convert page to integer with base 10
    const skip = (pageNumber - 1) * pageSize; // Calculate the number of documents to skip
    const userId = req.user.id;

    const totalProducts = await Product.countDocuments({
      user: { $in: userId },
    });

    const userProducts = await Products.find({ user: userId })
      .skip(skip)
      .limit(pageSize);

    res.status(200).json({ totalProducts, userProducts });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "user",
      "company_Name picture username"
    ); // to the newest to the oldest the way post come

    res.status(200).json(product);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const product = await new Product(req.body).save();
    res.status(200).json(product);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
exports.deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndRemove(req.params.id);
    res.json({ status: "ok" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
exports.editProduct = async (req, res) => {
  try {
    const { infos } = req.body;

    const updated = await User.findByIdAndUpdate(
      req.user.id,
      {
        details: infos,
      },
      {
        new: true,
      }
    );
    res.json(updated.details);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.getCompany = async (req, res) => {
  try {
    const { economic, items, page } = req.params;
    const pageSize = parseInt(items, 10); // Convert items to integer with base 10
    const pageNumber = parseInt(page, 10); // Convert page to integer with base 10
    const skip = (pageNumber - 1) * pageSize; // Calculate the number of documents to skip

    const totalUsers = await User.countDocuments({
      Economic_Sector: economic,
    });

    const users = await User.aggregate([
      { $match: { Economic_Sector: economic } },
      { $skip: skip }, // Skip documents based on pagination
      { $limit: pageSize }, // Limit the number of documents returned
    ]);
    res.status(200).json({ totalUsers, users });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getSectorProducts = async (req, res) => {
  try {
    const { economic, category, items, page } = req.params;
    const pageSize = parseInt(items, 10); // Convert items to integer with base 10
    const pageNumber = parseInt(page, 10); // Convert page to integer with base 10
    const skip = (pageNumber - 1) * pageSize; // Calculate the number of documents to skip

    const economicSectorUser = await User.find({
      Economic_Sector: economic,
    }).select("_id");

    const userIds = economicSectorUser.map((user) => user._id);

    const totalPosts = await Products.countDocuments({
      user: { $in: userIds },
      type: null,
      category: category,
    });

    const usersPosts = await Products.aggregate([
      { $match: { user: { $in: userIds }, type: null, category: category } },
      { $skip: skip }, // Skip documents based on pagination
      { $limit: pageSize }, // Limit the number of documents returned
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
    ]);
    res.status(200).json({ totalPosts, usersPosts });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getSectorOffer = async (req, res) => {
  try {
    const { economic, category, items, page } = req.params;
    const pageSize = parseInt(items, 10); // Convert items to integer with base 10
    const pageNumber = parseInt(page, 10); // Convert page to integer with base 10
    const skip = (pageNumber - 1) * pageSize; // Calculate the number of documents to skip

    const totalProducts = await Product.countDocuments({
      Economic_Sector: economic,
      category: category,
    });

    const usersPosts = await Product.aggregate([
      { $match: { Economic_Sector: economic, category: category } },
      { $skip: skip }, // Skip documents based on pagination
      { $limit: pageSize }, // Limit the number of documents returned
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
    ]);
    res.status(200).json({ totalProducts, usersPosts });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getPost = async (req, res) => {
  try {
    const product = await Post.findById(req.params.id).populate(
      "user",
      "company_Name picture username cover"
    ); // to the newest to the oldest the way post come

    res.json(product);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
exports.getCategoryProducts = async (req, res) => {
  try {
    const { category, items, page } = req.params;
    const pageSize = parseInt(items, 10); // Convert items to integer with base 10
    const pageNumber = parseInt(page, 10); // Convert page to integer with base 10
    const skip = (pageNumber - 1) * pageSize; // Calculate the number of documents to skip

    const totalProducts = await Products.countDocuments({
      category: { $in: category },
    });

    const categoryProducts = await Products.find({ category: category })
      .populate("user", "company_Name picture username")
      .skip(skip)
      .limit(pageSize);

    res.status(200).json({ totalProducts, categoryProducts });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
