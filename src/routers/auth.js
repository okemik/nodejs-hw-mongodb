const express = require('express');
const router = express.Router();
const controller = require('../controllers/auth');

router.post('/send-reset-email', controller.sendResetEmail);
router.post('/reset-pwd', controller.resetPassword);

module.exports = router;
