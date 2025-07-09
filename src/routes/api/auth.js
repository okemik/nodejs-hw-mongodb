const express = require("express");
const router = express.Router();
const ctrl = require("../../controllers/auth");
const { validateBody } = require("../../middlewares");
const { emailSchema, resetPwdSchema } = require("../../schemas/users");
const { registerSchema } = require("../../schemas/users"); 
const { refreshTokenSchema } = require("../../schemas/users");

router.post("/send-reset-email", validateBody(emailSchema), ctrl.sendResetEmail);
router.post("/register", validateBody(registerSchema), ctrl.register);
router.post("/reset-pwd", validateBody(resetPwdSchema), ctrl.resetPassword);
router.post("/refresh-token", validateBody(refreshTokenSchema), ctrl.refreshToken);

module.exports = router;
