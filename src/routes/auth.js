const express = require("express");
const ctrl = require("../controllers/auth");
const ctrlWrapper = require("../utils/ctrlWrapper");
const validateBody = require("../middlewares/validateBody");
const { registerSchema, loginSchema } = require("../schemas/auth");

const router = express.Router();

router.post("/register", validateBody(registerSchema), ctrlWrapper(ctrl.register));
router.post("/login", validateBody(loginSchema), ctrlWrapper(ctrl.login));
router.post("/refresh", ctrlWrapper(ctrl.refresh));
router.post("/logout", ctrlWrapper(ctrl.logout));

module.exports = router;
