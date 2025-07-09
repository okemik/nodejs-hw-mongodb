const express = require("express");
const authRouter = require("./routes/api/auth");

const app = express();

app.use(express.json());

app.use("/auth", authRouter);

// diğer routerlar...

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ status, message });
});

module.exports = app;
