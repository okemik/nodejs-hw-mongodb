const jwt = require("jsonwebtoken");
const createError = require("http-errors");
const User = require("../models/User");

const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization || "";
  const [type, token] = authHeader.split(" ");

  if (type !== "Bearer" || !token) {
    return next(createError(401, "Not authorized"));
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user) throw createError(401, "User not found");

    req.user = user;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return next(createError(401, "Access token expired"));
    }
    next(createError(401, "Invalid token"));
  }
};

module.exports = authenticate;
