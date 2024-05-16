const express = require("express");
const {
  getAllProducts,
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
const {
  getAllProductsVisitor,
  getProductsbyTypeVisitor,
  getProductByIdVisitor,
  createProductVisitor,
  deleteProductVisitor,
  editProductVisitor,
  getMyProductsVisitor,
  getCompanyVisitor,
  getPostVisitor,
  getSectorProductsVisitor,
  getSectorOfferVisitor,
  getCategoryProductsVisitor,
} = require("../controllers/productsVisitor");
const { authUser } = require("../middlewares/auth");

const router = express.Router();
router.get("/getAllProducts/:items/:page", authUser, getAllProducts);
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
router.get("/getAllProductsVisitor/:items/:page", getAllProductsVisitor);
router.get("/getMyProductsVisitor/:items/:page", getMyProductsVisitor);
router.get("/getProductByIdVisitor/:id", getProductByIdVisitor);
router.get("/getProductsbyTypeVisitor/:type", getProductsbyTypeVisitor);
router.post("/createProductVisitor", createProductVisitor);
router.delete("/deleteProductvisitor/:id", deleteProductVisitor);
router.put("/editProduct", editProduct);
router.get("/getCompanyVisitor/:economic/:items/:page", getCompanyVisitor);
router.get(
  "/getSectorProductsVisitor/:economic/:category/:items/:page",
  authUser,
  getSectorProductsVisitor
);
router.get(
  "/getCategoryProductsVisitor/:category/:items/:page",
  authUser,
  getCategoryProductsVisitor
);
router.get("/getPostVisitor/:id", authUser, getPostVisitor);
router.get(
  "/getSectorOfferVisitor/:economic/:category/:items/:page",
  authUser,
  getSectorOfferVisitor
);

module.exports = router;
