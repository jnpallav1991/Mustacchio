"use strict";

const router = require("express").Router(),
	blogPostsController = require("../controllers/blogPostsController");

router.get("/", blogPostsController.showAllPosts);
router.get("/:id", blogPostsController.showPost);

module.exports = router;
