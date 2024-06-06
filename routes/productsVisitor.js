const express = require("express");

const {
  getAllProductsVisitor,
  getProductsbyTypeVisitor,
  getProductByIdVisitor,
  createProductVisitor,
  getCompanyVisitor,
  getPostVisitor,
  getSectorProductsVisitor,
  getSectorOfferVisitor,
  getCategoryProductsVisitor,
  getSectorVisitor,
} = require("../controllers/productsVisitor");

const router = express.Router();

router.get("/getAllProductsVisitor/:items/:page", getAllProductsVisitor);
router.get("/getProductByIdVisitor/:id", getProductByIdVisitor);
router.get("/getProductsbyTypeVisitor/:type", getProductsbyTypeVisitor);
router.post("/createProductVisitor", createProductVisitor);
router.get("/getCompanyVisitor/:economic/:items/:page", getCompanyVisitor);
router.get("/getSectorVisitor/:sector/:items/:page", getSectorVisitor);
router.get(
  "/getSectorProductsVisitor/:economic/:category/:items/:page",
  getSectorProductsVisitor
);
router.get(
  "/getCategoryProductsVisitor/:category/:items/:page",

  getCategoryProductsVisitor
);
router.get("/getPostVisitor/:id", getPostVisitor);
router.get(
  "/getSectorOfferVisitor/:economic/:category/:items/:page",
  getSectorOfferVisitor
);

module.exports = router;
