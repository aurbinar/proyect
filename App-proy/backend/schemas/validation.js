import Joi from 'joi';

const registerSchema = Joi.object({
  name: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  phone: Joi.string().pattern(/^\d{9}$/).trim().required()
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
});

const recoverSchema = Joi.object({
  email: Joi.string().email().required(),
});

const resetSchema = Joi.object({
  password: Joi.string().min(8).required()
});

const phoneSchema = Joi.string().pattern(/^\d{9}$/).trim().required();

export { registerSchema, loginSchema, recoverSchema, resetSchema, phoneSchema };