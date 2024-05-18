const express = require("express");

const {
  getAllProductsVisitor,
  getProductsbyTypeVisitor,
  getProductByIdVisitor,
  createProductVisitor,
  deleteProductVisitor,

  getMyProductsVisitor,
  getCompanyVisitor,
  getPostVisitor,
  getSectorProductsVisitor,
  getSectorOfferVisitor,
  getCategoryProductsVisitor,
} = require("../controllers/productsVisitor");
const { authUser } = require("../middlewares/auth");

const router = express.Router();

router.get("/getAllProductsVisitor/:items/:page", getAllProductsVisitor);
router.get("/getMyProductsVisitor/:items/:page", getMyProductsVisitor);
router.get("/getProductByIdVisitor/:id", getProductByIdVisitor);
router.get("/getProductsbyTypeVisitor/:type", getProductsbyTypeVisitor);
router.post("/createProductVisitor", createProductVisitor);
router.delete("/deleteProductvisitor/:id", deleteProductVisitor);
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
