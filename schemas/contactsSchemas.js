import Joi from "joi";

export const createContactSchema = Joi.object({
    name: Joi.string().min(3).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().pattern(/^\+?[0-9]{7,15}$/).required(),
});

export const updateContactSchema = Joi.object({
    name: Joi.string().min(3),
    email: Joi.string().email(),
    favorite: Joi.boolean(),
    phone: Joi.string().pattern(/^\+?[0-9]{7,15}$/),
}).min(1).messages({
    "object.min": "Body must have at least one field"
});