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
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) throw createError(401, 'Email or password is wrong');

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw createError(401, 'Email or password is wrong');

    // Daha önceki oturumu sil
    await Session.deleteMany({ userId: user._id });

    // Yeni tokenler oluştur
    const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });

    // Oturumu kaydet
    await Session.create({
      userId: user._id,
      accessToken,
      refreshToken,
      accessTokenValidUntil: new Date(Date.now() + 15 * 60 * 1000),
      refreshTokenValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });

    // Refresh token'ı httpOnly cookie olarak gönder
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
    });

    // Access token'ı JSON olarak döndür
    res.status(200).json({
      status: 'success',
      message: 'Successfully logged in a user!',
      data: { accessToken },
    });
  } catch (error) {
    next(error);
  }
};

exports.sendResetEmail = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) throw createError(404, 'User not found!');

    // 5 dakikalık geçerli JWT token üret
    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '5m' });
    const resetLink = `${process.env.APP_DOMAIN}/reset-password?token=${token}`;

    // Mail gönder
    await sendEmail({
      to: email,
      subject: 'Reset Password',
      html: `<p>Please click the link to reset your password:</p><a href="${resetLink}">${resetLink}</a>`
    });

    res.status(200).json({
      status: 200,
      message: 'Reset password email has been successfully sent.',
      data: {}
    });
  } catch (err) {
    next(createError(500, 'Failed to send the email, please try again later.'));
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;
    const { email } = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ email });
    if (!user) throw createError(404, 'User not found!');

    user.password = await bcrypt.hash(password, 10);
    await user.save();

    // Kullanıcının tüm oturumlarını sil
    await Session.deleteMany({ userId: user._id });

    res.status(200).json({
      status: 200,
      message: 'Password has been successfully reset.',
      data: {}
    });
  } catch (err) {
    next(createError(401, 'Token is expired or invalid.'));
  }
};

exports.refreshSession = async (req, res, next) => {
  try {
    // Refresh token cookie'den alınır
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) throw createError(401, 'Refresh token missing');

    // Token doğrula
    const payload = jwt.verify(refreshToken, process.env.JWT_SECRET);
    const userId = payload.userId || payload.id;

    const user = await User.findById(userId);
    if (!user) throw createError(404, 'User not found!');

    // Önceki oturumu sil
    await Session.deleteMany({ userId });

    // Yeni tokenler oluştur
    const newAccessToken = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '15m' });
    const newRefreshToken = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '30d' });

    // Yeni oturum kaydet
    await Session.create({
      userId,
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      accessTokenValidUntil: new Date(Date.now() + 15 * 60 * 1000),
      refreshTokenValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });

    // Yeni refresh token'ı cookie'ye yaz
    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
    });

    // Yeni access token'ı döndür
    res.status(200).json({
      status: 200,
      message: 'Successfully refreshed a session!',
      data: { accessToken: newAccessToken },
    });
  } catch (err) {
    next(createError(401, 'Refresh token is expired or invalid.'));
  }
};

exports.logout = async (req, res, next) => {
  try {
    // Refresh token cookie'den al
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(204).send(); // Zaten logout olmuş
    }

    // Tokeni doğrula
    const payload = jwt.verify(refreshToken, process.env.JWT_SECRET);
    const userId = payload.userId || payload.id;

    // Oturumu sil
    await Session.deleteMany({ userId });

    // Çerezden refresh token'ı sil
    res.clearCookie('refreshToken', {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
    });

    res.status(204).send();
  } catch (err) {
    next(err);
  }
};