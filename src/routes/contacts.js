const express = require("express");
const ctrl = require("../controllers/contacts");
const ctrlWrapper = require("../utils/ctrlWrapper");

const router = express.Router();

router.post("/", ctrlWrapper(ctrl.createContact));
router.get("/:contactId", ctrlWrapper(ctrl.getContactById));
router.patch("/:contactId", ctrlWrapper(ctrl.updateContact));
router.delete("/:contactId", ctrlWrapper(ctrl.deleteContact));

module.exports = router;
