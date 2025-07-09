// src/middlewares/index.js

const validateBody = require("./validateBody");
const errorHandler = require("./errorHandler");
const notFoundHandler = require("./notFoundHandler");
// varsa diğer middleware'ler...

module.exports = {
  validateBody,
  errorHandler,
  notFoundHandler,
};
