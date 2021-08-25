"use strict";

const router = require("express").Router(),
errorController = require("../controllers/errorController");


router.use(errorController.handleErrors);

module.exports = router;