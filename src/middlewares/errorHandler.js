// src/middlewares/errorHandler.js

const errorHandler = (err, req, res, next) => {
    const { status = 500, message = "Internal Server Error" } = err;
    res.status(status).json({
      status: "error",
      code: status,
      message,
    });
  };
  
  module.exports = errorHandler;
  