"use strict";

const router = require("express").Router(),
	apiController = require("../controllers/apiController");

router.get("/token", apiController.getToken);
router.use(apiController.verifyToken);
router.get("/styles", apiController.getStyles);
router.use(apiController.errorJSON);

module.exports = router;
