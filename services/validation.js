const Joi = require('joi');

const schemaCreateContact = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
    .required(),
  phone: Joi.string().required(),
});

const schemaUpdateContact = Joi.object({
  name: Joi.string().min(3).max(30).optional(),
  email: Joi.string().email().optional(),
  phone: Joi.string()
    .pattern(/[+]d{3}s[(]d{2}[)]sd{3}[-]d{2}[-]d{2}/)
    .optional(),
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

module.exports.createConatat = (req, res, next) => {
  return validate(schemaCreateContact, req.body, next);
};

module.exports.updateConatat = (req, res, next) => {
  return validate(schemaUpdateContact, req.body, next);
};
