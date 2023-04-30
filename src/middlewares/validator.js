import Joi from "joi"; //Is necesary to use validate

const validateObject = (schema) => (req, res, next) => {
  const object = req.body;
  const result = schema.validate(object);

  if (result.error)
    return res.status(400).json({ status: "error", payload: result.error });
  next();
};

export default validateObject;
