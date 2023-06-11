import Joi from "joi";

export const userCreateSchema = Joi.object({
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ["com", "net", "ar"] } }).required(),
    gender: Joi.string(),
    password: Joi.string().required()
});

export const userUpdateSchema = Joi.object({
    first_name: Joi.string(),
    last_name: Joi.string(),
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ["com", "net", "ar"] } }),
    gender: Joi.string(),
    password: Joi.string(),
    status: Joi.boolean(),
    role: Joi.string()
});
