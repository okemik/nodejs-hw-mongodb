const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/send-reset-email', authController.sendResetEmail);
router.post('/reset-pwd', authController.resetPassword);
router.post('/refresh', authController.refreshSession);
router.post('/logout', authController.logout);

module.exports = router;
