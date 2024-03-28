const Product = require("../models/Products");

exports.getAllProducts = async (req, res) => {
  try {
    const product = await Product.find().sort({ createdAt: -1 }); // to the newest to the oldest the way post come
    res.json(product);
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
    const userId = req.user.id;

    const product = await Product.find({
      user: userId,
    }).sort({
      createdAt: -1,
    }); // to the newest to the oldest the way post come

    res.json(product);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "user",
      "company_Name picture"
    ); // to the newest to the oldest the way post come

    res.json(product);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const product = await new Product(req.body).save();
    res.json(product);
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
