const express = require("express");
const {
  getAllProducts,
  getProductsbyType,
  getProductById,
  createProduct,
  deleteProduct,
  editProduct,
} = require("../controllers/products");
const { authUser } = require("../middlewares/auth");

const router = express.Router();
router.get("/getAllProducts", authUser, getAllProducts);
router.get("/getProductById/:id", authUser, getProductById);
router.get("/getProductsbyType/:type", authUser, getProductsbyType);
router.post("/createProduct", authUser, createProduct);
router.delete("/deleteProduct", authUser, deleteProduct);
router.put("/editProduct", authUser, editProduct);

module.exports = router;
