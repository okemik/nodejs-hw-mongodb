// src/middlewares/notFoundHandler.js

function notFoundHandler(req, res, next) {
  res.status(404).json({
    status: 404,
    message: "Not Found",
  });
}

module.exports = notFoundHandler;
