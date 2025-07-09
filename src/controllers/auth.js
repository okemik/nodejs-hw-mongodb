const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const createError = require('http-errors');
const User = require('../models/User');
const Session = require('../models/Session');
const sendEmail = require('../utils/sendEmail');

exports.register = async (req, res, next) => {
  // register işlemi
};

exports.login = async (req, res, next) => {
  // login işlemi
};

exports.sendResetEmail = async (req, res, next) => {
  // senin verdiğin kod burada olacak
};

exports.resetPassword = async (req, res, next) => {
  // senin verdiğin kod burada olacak
};

exports.refreshSession = async (req, res, next) => {
  // refresh işlemi
};

exports.logout = async (req, res, next) => {
  // logout işlemi
};
