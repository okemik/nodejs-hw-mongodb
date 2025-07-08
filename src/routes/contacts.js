const express = require("express");
const ctrl = require("../controllers/contacts");
const ctrlWrapper = require("../utils/ctrlWrapper");

const router = express.Router();

router.get("/", ctrlWrapper(ctrl.getAllContacts)); // <-- EKLE!
router.post("/", ctrlWrapper(ctrl.createContact));
router.get("/:contactId", ctrlWrapper(ctrl.getContactById));
router.patch("/:contactId", ctrlWrapper(ctrl.updateContact));
router.delete("/:contactId", ctrlWrapper(ctrl.deleteContact));

module.exports = router;

const validateBody = require("../middlewares/validateBody");
const isValidId = require("../middlewares/isValidId");
const { addSchema, updateSchema } = require("../schemas/contacts");

router.post("/", validateBody(addSchema), ctrl.addContact);
router.patch("/:contactId", isValidId, validateBody(updateSchema), ctrl.updateContact);
