const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const createError = require("http-errors");
const User = require("../models/User");
const Session = require("../models/Session");
const { v4: uuidv4 } = require("uuid");

const registerUser = async ({ name, email, password }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) throw createError(409, "Email in use");

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await User.create({ name, email, password: hashedPassword });
  const { password: _, ...userData } = newUser.toObject();
  return userData;
};

const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw createError(401, "Invalid credentials");
  }

  await Session.deleteMany({ userId: user._id });

  const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "15m" });
  const refreshToken = uuidv4();
  const now = new Date();

  await Session.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(now.getTime() + 15 * 60 * 1000),
    refreshTokenValidUntil: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
  });

  return { accessToken, refreshToken };
};

const refreshSession = async (oldRefreshToken) => {
  const session = await Session.findOne({ refreshToken: oldRefreshToken });
  if (!session || session.refreshTokenValidUntil < new Date()) {
    throw createError(401, "Invalid or expired refresh token");
  }

  await Session.deleteOne({ _id: session._id });

  const accessToken = jwt.sign({ userId: session.userId }, process.env.JWT_SECRET, { expiresIn: "15m" });
  const refreshToken = uuidv4();
  const now = new Date();

  await Session.create({
    userId: session.userId,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(now.getTime() + 15 * 60 * 1000),
    refreshTokenValidUntil: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
  });

  return { accessToken, refreshToken };
};

const logoutUser = async (refreshToken) => {
  await Session.deleteOne({ refreshToken });
};

module.exports = {
  registerUser,
  loginUser,
  refreshSession,
  logoutUser,
};
