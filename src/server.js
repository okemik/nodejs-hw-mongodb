const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");

const contactsRouter = require("./routes/contacts");
const authRouter = require("./routes/auth");
const notFoundHandler = require("./middlewares/notFoundHandler");
const errorHandler = require("./middlewares/errorHandler");

dotenv.config();
const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/contacts", contactsRouter);
app.use("/auth", authRouter);
app.use(notFoundHandler);
app.use(errorHandler);

mongoose
  .connect(process.env.DB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(process.env.PORT || 3000, () => {
      console.log("Server running");
    });
  })
  .catch((err) => console.error(err));
