const authService = require("../services/auth");
const createError = require("http-errors");

const register = async (req, res) => {
  const user = await authService.registerUser(req.body);
  res.status(201).json({
    status: 201,
    message: "Successfully registered a user!",
    data: user,
  });
};

const login = async (req, res) => {
  const { accessToken, refreshToken } = await authService.loginUser(req.body);
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    sameSite: "Strict",
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });
  res.status(200).json({
    status: 200,
    message: "Successfully logged in an user!",
    data: { accessToken },
  });
};

const refresh = async (req, res) => {
  const oldToken = req.cookies.refreshToken;
  if (!oldToken) throw createError(401, "No refresh token provided");

  const { accessToken, refreshToken } = await authService.refreshSession(oldToken);

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    sameSite: "Strict",
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    status: 200,
    message: "Successfully refreshed a session!",
    data: { accessToken },
  });
};

const logout = async (req, res) => {
  const token = req.cookies.refreshToken;
  if (token) await authService.logoutUser(token);
  res.clearCookie("refreshToken");
  res.status(204).send();
};

module.exports = {
  register,
  login,
  refresh,
  logout,
};
