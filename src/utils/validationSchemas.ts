import Joi from 'joi';

export const userSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  name: Joi.string().required(),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const transactionPinSchema = Joi.object({
  userId: Joi.string().required(),
  pin: Joi.string().length(4).pattern(/^[0-9]+$/).required(),
});

export const donationSchema = Joi.object({
  beneficiaryEmail: Joi.string().email().required(),
  amount: Joi.number().positive().required(),
});

export const walletSchema = Joi.object({
  userId: Joi.string().required(),
});

export const donationPeriodSchema = Joi.object({
  startDate: Joi.date().iso().required(),
  endDate: Joi.date().iso().min(Joi.ref('startDate')).required(),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).default(10),
});
