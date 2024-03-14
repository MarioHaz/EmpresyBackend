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
    const product = await Product.find(req.params.type).sort({ createdAt: -1 }); // to the newest to the oldest the way post come
    res.json(product);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).sort({
      createdAt: -1,
    }); // to the newest to the oldest the way post come
    res.json(product);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const product = await new Product(req.body).save();
    await product.populate("user", "company_Name picture cover username");

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
    await Product.findOneAndUpdate(req.params.id);
    res.json({ status: "ok" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
