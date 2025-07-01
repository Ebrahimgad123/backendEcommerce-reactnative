import Joi from "joi";

export const createUserSchema = Joi.object({
  username: Joi.string().required().min(2).max(50),
  email: Joi.string().required().email(),
  password: Joi.string().required().min(8),
});
export const loginUserSchema = Joi.object({
  email: Joi.string().required().email(),
  password: Joi.string().required().min(8),
});

export const createProductSchema = Joi.object({
  name: Joi.string().required().min(2).max(50),
  description: Joi.string().required().min(2).max(300),
  quantity: Joi.number().required().min(0),
  price: Joi.number().required(),
  category: Joi.string().required().min(2).max(50),
  stockQuantity: Joi.number().default(0),
  images: Joi.array().items(Joi.string()),
  ratings: Joi.array().items(
    Joi.object({
      userId: Joi.string().required(),
      rating: Joi.number().min(1).max(5),
      comment: Joi.string().trim(),
      createdAt: Joi.date().default(Date.now),
    })
  ),
  createdAt: Joi.date().default(Date.now),
  updatedAt: Joi.date().default(Date.now),
})