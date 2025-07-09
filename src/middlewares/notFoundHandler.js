// src/middlewares/notFoundHandler.js

const createHttpError = require("http-errors");

const notFoundHandler = (req, res, next) => {
  next(createHttpError(404, `Route ${req.originalUrl} not found`));
};

module.exports = notFoundHandler;
