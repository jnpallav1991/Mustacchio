"use strict";

const router = require("express").Router(),
	articleSearchController = require("../controllers/articleSearchController");


router.get("/articleSearch", articleSearchController.articleSearch);
router.post("/search",articleSearchController.searchArticle);

module.exports = router;
