const express = require("express");
const {
  uploadImages,
  listImages,
  listImagesVisitor,
} = require("../controllers/upload");
const { authUser } = require("../middlewares/auth");
const imagesUpload = require("../middlewares/imagesUpload");

const router = express.Router();

router.post("/uploadImages", imagesUpload, authUser, uploadImages);
router.post("/listImages", authUser, listImages);
router.post("/listImagesVisitor", listImagesVisitor);

module.exports = router;
