const Joi = require("joi");
const { joiPasswordExtendCore } = require("joi-password");
const joipassword = Joi.extend(joiPasswordExtendCore);

const addMovieValidation = Joi.object({
  title: Joi.string().min(3).max(100).required(),
  description: Joi.string().min(3).max(5000).required(),
  poster_api: Joi.string().min(1).max(2000).required(),
  movie_type: Joi.string().min(4).max(50).required(),
  is_released: Joi.boolean().required(),
});

const updateMovieValidation = Joi.object().keys({
  title: Joi.string().min(3).max(100),
  description: Joi.string().min(1).max(1000),
  poster_api: Joi.string().min(1).max(2000).required(),
  movie_type: Joi.string().min(4).max(50).required(),
  is_released: Joi.boolean().required(),
});

const registerUserValidation = Joi.object().keys({
  name: Joi.string().min(3).max(40).required(),
  email: Joi.string().email().required(),
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
});

const forgotPasswordValidation = Joi.object().keys({
  email: Joi.string().email().required(),
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
});
module.exports = {
  addMovieValidation,
  updateMovieValidation,
  registerUserValidation,
  forgotPasswordValidation,
};
