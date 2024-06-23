const Product = require("../models/Products");
const User = require("../models/User");
const Post = require("../models/Post");
const Products = require("../models/Products");
const stringSimilarity = require("string-similarity");

exports.getAllProductsVisitor = async (req, res) => {
  try {
    const { items, page } = req.params;
    const { visitorLocation } = req.body;
    const pageSize = parseInt(items, 10);
    const pageNumber = parseInt(page, 10);
    const skip = (pageNumber - 1) * pageSize;

    let totalProducts, productss;

    if (!visitorLocation) {
      totalProducts = await Product.countDocuments();
      productss = await Product.find()
        .populate("user", "company_Name picture username location")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(pageSize);
    } else {
      // Fetch all users to apply string similarity check
      const allUsers = await User.find();

      // Calculate similarity scores
      const usersWithSimilarity = allUsers.map((user) => {
        const similarity = stringSimilarity.compareTwoStrings(
          visitorLocation.toLowerCase(),
          (user.details.currentCity || "").toLowerCase()
        );
        return { user, similarity };
      });

      // Sort users by similarity score in descending order
      usersWithSimilarity.sort((a, b) => b.similarity - a.similarity);

      // Filter users based on the similarity threshold
      const similarUsers = usersWithSimilarity
        .filter((entry) => entry.similarity >= 0.4)
        .map((entry) => entry.user);

      const userIds = similarUsers.map((user) => user._id);

      // Count products from these users
      totalProducts = await Product.countDocuments({ user: { $in: userIds } });

      // Fetch products from these users with pagination
      productss = await Product.find({ user: { $in: userIds } })
        .populate("user", "company_Name picture username")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(pageSize);
    }

    res.status(200).json({ totalProducts, productss });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getSectorVisitor = async (req, res) => {
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

exports.getProductsbyTypeVisitor = async (req, res) => {
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

exports.getProductByIdVisitor = async (req, res) => {
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

exports.createProductVisitor = async (req, res) => {
  try {
    const productCreate = await new Product(req.body).save();
    const product_id = productCreate._id;
    const product = await Product.findById(product_id).populate(
      "user",
      "company_Name picture username"
    );
    res.status(200).json(product);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.getCompanyVisitor = async (req, res) => {
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

exports.getSectorProductsVisitor = async (req, res) => {
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

exports.getSectorOfferVisitor = async (req, res) => {
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

exports.getPostVisitor = async (req, res) => {
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
exports.getCategoryProductsVisitor = async (req, res) => {
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
