"use strict";

const router = require("express").Router(),
	usersController = require("../controllers/usersController");



router.get("/register", usersController.register);
router.post("/create", usersController.validate, usersController.create, usersController.redirectView);
router.get("/login", usersController.login);
router.post("/login", usersController.authenticate);
router.get("/logout", usersController.logout, usersController.redirectView);
router.use(usersController.verifyAdmin);
router.get("/", usersController.index, usersController.indexView);
router.post("/updateAdminPrivileges",usersController.updateAdminPrivilege,usersController.redirectView);

module.exports = router;