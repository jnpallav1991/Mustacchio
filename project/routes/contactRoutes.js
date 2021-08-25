"use strict";

const router = require("express").Router(),
	contactsController = require("../controllers/contactsController"),
	usersController = require("../controllers/usersController");

router.get("/new", contactsController.newContact);
router.post("/create", contactsController.createContact);
router.use(usersController.verifyAdmin);
router.get("/", contactsController.getUnrespondedContacts);
router.get("/:id/edit", contactsController.getContactById);
router.post("/:id/update", contactsController.updateContactById);

module.exports = router;