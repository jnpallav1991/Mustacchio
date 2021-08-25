"use strict";

const router = require("express").Router(),
	stylesController = require("../controllers/stylesController"),
	usersController = require("../controllers/usersController");

router.get("/", stylesController.showAllStyles);
router.get("/newstyle", stylesController.createNewStyle);
router.get("/favoritestyle", usersController.verifyLoginUser,stylesController.getFavoriteStyle);
router.get("/:id", stylesController.showStyle);
router.get("/:id/savefavorite", usersController.verifyLoginUser,stylesController.saveAsFavorite, stylesController.redirectView);
router.post("/upload", stylesController.uploadStyle, stylesController.createStyle, stylesController.redirectView);

module.exports = router;