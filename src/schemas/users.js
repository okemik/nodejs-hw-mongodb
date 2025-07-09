const Joi = require("joi");

const emailSchema = Joi.object({
  email: Joi.string().email().required(),
});

const resetPwdSchema = Joi.object({
  token: Joi.string().required(),
  password: Joi.string().min(6).required(),
});

const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

const refreshTokenSchema = Joi.object({
  refreshToken: Joi.string().required(),
});

module.exports = {
  emailSchema,
  resetPwdSchema,
  registerSchema,
  refreshTokenSchema,
};
