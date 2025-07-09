const express = require("express");
const router = express.Router();
const ctrl = require("../../controllers/auth");
const { validateBody } = require("../../middlewares");
const { emailSchema, resetPwdSchema } = require("../../schemas/users");
const { registerSchema } = require("../../schemas/users"); // register için schema ekle

router.post("/send-reset-email", validateBody(emailSchema), ctrl.sendResetEmail);
router.post("/register", validateBody(registerSchema), ctrl.register);
router.post("/reset-pwd", validateBody(resetPwdSchema), ctrl.resetPassword);

module.exports = router;
