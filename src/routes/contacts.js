const express = require("express");
const ctrl = require("../controllers/contacts");
const ctrlWrapper = require("../utils/ctrlWrapper");
const validateBody = require("../middlewares/validateBody");
const { addSchema, updateSchema } = require("../schemas/contacts");
const isValidId = require("../middlewares/isValidId");

const router = express.Router();

router.get("/", ctrlWrapper(ctrl.getAllContacts));
router.post("/", validateBody(addSchema), ctrlWrapper(ctrl.createContact));
router.get("/:contactId", ctrlWrapper(ctrl.getContactById));
router.patch("/:contactId", isValidId, validateBody(updateSchema), ctrlWrapper(ctrl.updateContact));
router.delete("/:contactId", ctrlWrapper(ctrl.deleteContact));

module.exports = router;
