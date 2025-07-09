const jwt = require('jsonwebtoken');
const createError = require('http-errors');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) throw createError(401, 'Access token required');
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { _id: payload.userId };
    next();
  } catch (err) {
    next(createError(401, 'Access token expired or invalid'));
  }
};
