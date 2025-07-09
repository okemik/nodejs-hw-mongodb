const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const createError = require('http-errors');
const User = require('../models/User');
const Session = require('../models/Session');
const sendEmail = require('../utils/sendEmail');

exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // 1. Email zaten var mı kontrol et
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw createError(409, 'Email in use');
    }

    // 2. Şifreyi hashle
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Yeni kullanıcı oluştur
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // 4. Şifreyi response'dan çıkar
    const userResponse = {
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      createdAt: newUser.createdAt,
      updatedAt: newUser.updatedAt,
    };

    // 5. Başarılı yanıt gönder
    res.status(201).json({
      status: 'success',
      message: 'Successfully registered a user!',
      data: userResponse,
    });
  } catch (error) {
    next(error);
  }
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
