const express = require("express");
const { fetchDynamicRoutes } = require("../controllers/routes_sitemap");

const router = express.Router();
router.get("/fetchDynamicRoutes", fetchDynamicRoutes);

module.exports = router;
