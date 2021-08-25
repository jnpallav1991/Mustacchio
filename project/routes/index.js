"use strict";

const router = require("express").Router(),
  userRoutes = require("./userRoutes"),
  contactRoutes = require("./contactRoutes"),
  blogRoutes = require("./blogRoutes"),
  styleRoutes = require("./styleRoutes"),
  articleSearchRoutes = require("./articleSearchRoutes"),
  errorRoutes = require("./errorRoutes"),
  homeRoutes = require("./homeRoutes"),
  apiRoutes = require("./apiRoutes");

router.use("/users", userRoutes);
router.use("/contacts", contactRoutes);
router.use("/blog", blogRoutes);
router.use("/style", styleRoutes);
router.use("/nytimes", articleSearchRoutes);
router.use("/api", apiRoutes);
router.use("/", homeRoutes);
router.use("/", errorRoutes);

module.exports = router;
