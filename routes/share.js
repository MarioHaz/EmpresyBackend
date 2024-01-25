const express = require("express");
const { share } = require("../controllers/share");
const { authUser } = require("../middlewares/auth");

const router = express.Router();

router.post("/share", authUser, share);

module.exports = router;
