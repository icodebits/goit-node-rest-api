import Joi from "joi";

export const authSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

export const verifySchema = Joi.object({
  email: Joi.string().email().required()
});