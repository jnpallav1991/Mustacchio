"use strict";

const router = require("express").Router(),
  homeController = require("../controllers/homeController");

router.get("/index", homeController.home);
router.get("/about", homeController.about);

module.exports = router;