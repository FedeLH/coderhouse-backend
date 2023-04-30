import Joi from "joi";

export const productCreateSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  price: Joi.number().required(),
  stock: Joi.number().required(),
  code: Joi.string().required(),
  category: Joi.string().required(),
  status: Joi.boolean(),
  thumbnails: Joi.array(),
});

export const productUpdateSchema = Joi.object({
  title: Joi.string(),
  description: Joi.string(),
  price: Joi.number(),
  stock: Joi.number(),
  code: Joi.string(),
  category: Joi.string(),
  status: Joi.boolean(),
  thumbnails: Joi.array(),
});
