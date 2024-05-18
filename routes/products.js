const express = require("express");
const {
  getAllProducts,
  getSector,
  getProductsbyType,
  getProductById,
  createProduct,
  deleteProduct,
  editProduct,
  getMyProducts,
  getCompany,
  getPost,
  getSectorProducts,
  getSectorOffer,
  getCategoryProducts,
} = require("../controllers/products");

const { authUser } = require("../middlewares/auth");

const router = express.Router();
router.get("/getAllProducts/:items/:page", authUser, getAllProducts);
router.get("/getSector/:sector/:items/:page", authUser, getSector);
router.get("/getMyProducts/:items/:page", authUser, getMyProducts);
router.get("/getProductById/:id", authUser, getProductById);
router.get("/getProductsbyType/:type", authUser, getProductsbyType);
router.post("/createProduct", authUser, createProduct);
router.delete("/deleteProduct/:id", authUser, deleteProduct);
router.put("/editProduct", authUser, editProduct);
router.get("/getCompany/:economic/:items/:page", authUser, getCompany);
router.get(
  "/getSectorProducts/:economic/:category/:items/:page",
  authUser,
  getSectorProducts
);
router.get(
  "/getCategoryProducts/:category/:items/:page",
  authUser,
  getCategoryProducts
);
router.get("/getPost/:id", authUser, getPost);
router.get(
  "/getSectorOffer/:economic/:category/:items/:page",
  authUser,
  getSectorOffer
);

module.exports = router;
