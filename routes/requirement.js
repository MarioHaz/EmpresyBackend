const express = require("express");
const {
  createRequirement,
  getAllRequirements,
  deleteRequirement,
} = require("../controllers/requirement");
const { authUser } = require("../middlewares/auth");

const router = express.Router();

router.post("/createRequirement", authUser, createRequirement);
router.get("/getAllRequirements", authUser, getAllRequirements);
router.delete("/deleteRequirement/:id", authUser, deleteRequirement);

module.exports = router;
