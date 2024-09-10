import Joi from "joi";

export const createContactSchema = Joi.object({
  name: Joi.string().min(2).required(),
  email: Joi.string().min(5).required(),
  phone: Joi.string().min(5).required(),
});

export const updateContactSchema = Joi.object({
  name: Joi.string().min(2),
  email: Joi.string().min(5),
  phone: Joi.string().min(5),
});

export const updateContactStatusSchema = Joi.object({
  favorite: Joi.boolean().required(),
});
