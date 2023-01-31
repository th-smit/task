const Joi = require("joi");
const { joiPasswordExtendCore } = require("joi-password");
const joipassword = Joi.extend(joiPasswordExtendCore);

const addMovieValidation = Joi.object({
  title: Joi.string().min(3).max(100).required(),
  description: Joi.string().min(1).max(1000).required(),
  is_released: Joi.boolean().required(),
});

const updateMovieValidation = Joi.object().keys({
  title: Joi.string().min(3).max(100),
  description: Joi.string().min(1).max(1000),
  is_released: Joi.boolean(),
});

const registerUserValidation = Joi.object().keys({
  name: Joi.string().min(3).max(100).required(),
  email: Joi.string().min(3).email().required(),
  password: joipassword
    .string()
    .minOfSpecialCharacters(1)
    .minOfLowercase(1)
    .minOfUppercase(1)
    .minOfNumeric(1)
    .noWhiteSpaces()
    .min(4)
    .max(10)
    .required(),
  role: Joi.string().valid("user", "admin").required(),
});

module.exports = {
  addMovieValidation,
  updateMovieValidation,
  registerUserValidation,
};
