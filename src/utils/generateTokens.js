const jwt = require("jsonwebtoken");

const generateTokens = (userId) => {
  const accessTokenValidUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 dakika
  const refreshTokenValidUntil = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 gün

  const accessToken = jwt.sign({ userId }, process.env.ACCESS_SECRET, {
    expiresIn: "15m",
  });

  const refreshToken = jwt.sign({ userId }, process.env.REFRESH_SECRET, {
    expiresIn: "30d",
  });

  return {
    accessToken,
    refreshToken,
    accessTokenValidUntil,
    refreshTokenValidUntil,
  };
};

module.exports = generateTokens;
