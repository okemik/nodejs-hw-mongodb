const express = require('express');
const cookieParser = require('cookie-parser');
const createError = require('http-errors');
const authRouter = require('./routers/auth');
const contactRouter = require('./routers/contacts');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/auth', authRouter);
app.use('/contacts', contactRouter);

app.use((req, res, next) => next(createError(404, 'Not found')));
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    status: 'error',
    message: err.message,
  });
});

module.exports = app;
