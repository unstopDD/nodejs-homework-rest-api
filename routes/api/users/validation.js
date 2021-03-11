const Joi = require('joi');
const { HttpCode } = require('../../../helpers/constants');

const { BAD_REQUEST } = HttpCode;

const schemaRegistration = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
    .required(),
  password: Joi.string()
    .pattern(/^[a-zA-Z0-9]{3,30}$/)
    .required(),
});

const schemaLogin = Joi.object({
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
    .required(),
  password: Joi.string()
    .pattern(/^[a-zA-Z0-9]{3,30}$/)
    .required(),
});

const schemaUpdateSub = Joi.object({
  subscription: Joi.any().valid('free', 'pro', 'premium').required(),
});

const validate = (schema, obj, next) => {
  const { error } = schema.validate(obj);
  if (error) {
    const [{ message }] = error.details;
    return next({
      status: 400,
      message: `Filed: ${message.replace(/"/g, '')}`,
    });
  }

  next();
};

module.exports.registration = (req, res, next) => {
  return validate(schemaRegistration, req.body, next);
};

module.exports.login = (req, res, next) => {
  return validate(schemaLogin, req.body, next);
};

module.exports.updateSub = (req, _res, next) => {
  return validate(schemaUpdateSub, req.body, next);
};

module.exports.validateUploadAvatar = (req, res, next) => {
  if (!req.file) {
    return res.status(BAD_REQUEST).json({
      status: 'error',
      code: BAD_REQUEST,
      data: 'Bad request',
      message: 'Field of avatar with file not found',
    });
  }
  next();
};
