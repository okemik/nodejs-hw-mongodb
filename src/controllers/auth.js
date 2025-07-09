const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const createHttpError = require("http-errors");

const User = require("../models/User");
const sendEmail = require("../helpers/sendEmail");

const sendResetEmail = async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    throw createHttpError(404, "User not found!");
  }

  const payload = { email };
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "5m" });

  const resetLink = `${process.env.APP_DOMAIN}/reset-password?token=${token}`;

  const message = {
    to: email,
    subject: "Reset your password",
    html: `
      <p>Click the link below to reset your password:</p>
      <a href="${resetLink}">${resetLink}</a>
    `,
  };

  try {
    await sendEmail(message);
  } catch (error) {
    throw createHttpError(500, "Failed to send the email, please try again later.");
  }

  res.status(200).json({
    status: 200,
    message: "Reset password email has been successfully sent.",
    data: {},
  });
};

const resetPassword = async (req, res, next) => {
  const { token, password } = req.body;

  let email;
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    email = payload.email;
  } catch (error) {
    throw createHttpError(401, "Token is expired or invalid.");
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw createHttpError(404, "User not found!");
  }

  const hashPassword = await bcrypt.hash(password, 10);
  user.password = hashPassword;
  user.token = null; // mevcut oturumu bitirme isteği varsa
  await user.save();

  res.status(200).json({
    status: 200,
    message: "Password has been successfully reset.",
    data: {},
  });
};

const register = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({
      status: 201,
      message: "User registered successfully",
      data: { email: newUser.email },
    });
  } catch (error) {
    next(error);
  }
};

const refreshToken = async (req, res, next) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh token missing" });
  }

  try {
    const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    const user = await User.findById(payload.id);
    if (!user || user.token !== refreshToken) {
      return res.status(404).json({ message: "Not Found" });
    }
    // Yeni access token oluştur
    const newAccessToken = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    res.json({ accessToken: newAccessToken });
  } catch (error) {
    return res.status(401).json({ message: "Invalid refresh token" });
  }
};


module.exports = {
  sendResetEmail,
  resetPassword,
  register,
  refreshToken,
};