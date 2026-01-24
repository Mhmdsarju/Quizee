import Joi from "joi";

export const userIdUpdateSchema = Joi.object({
  id: Joi.string().hex().length(24).required(),
});
