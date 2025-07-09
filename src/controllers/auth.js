const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const createError = require('http-errors');
const User = require('../models/User');
const Session = require('../models/Session');
const sendEmail = require('../utils/sendEmail');
const authController = require('../controllers/auth');

exports.sendResetEmail = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) throw createError(404, 'User not found!');

    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '5m' });
    const link = `${process.env.APP_DOMAIN}/reset-password?token=${token}`;

    await sendEmail({ to: email, subject: 'Reset Password', html: `<a href="${link}">${link}</a>` });

    res.status(200).json({ status: 200, message: 'Reset password email has been successfully sent.', data: {} });
  } catch (err) {
    next(createError(500, 'Failed to send the email, please try again later.'));
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;
    const { email } = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ email });
    if (!user) throw createError(404, 'User not found!');

    user.password = await bcrypt.hash(password, 10);
    await user.save();
    await Session.deleteMany({ userId: user._id });

    res.status(200).json({ status: 200, message: 'Password has been successfully reset.', data: {} });
  } catch (err) {
    next(createError(401, 'Token is expired or invalid.'));
  }
};

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/send-reset-email', authController.sendResetEmail);
router.post('/reset-pwd', authController.resetPassword);
router.post('/refresh', authController.refreshSession);
router.post('/logout', authController.logout);

module.exports = router;