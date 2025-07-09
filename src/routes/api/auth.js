const express = require("express");
const router = express.Router();
const ctrl = require("../../controllers/auth");
const { validateBody } = require("../../middlewares");
const { emailSchema, resetPwdSchema } = require("../../schemas/users");

router.post("/send-reset-email", validateBody(emailSchema), ctrl.sendResetEmail);
router.post("/reset-pwd", validateBody(resetPwdSchema), ctrl.resetPassword);

module.exports = router;
