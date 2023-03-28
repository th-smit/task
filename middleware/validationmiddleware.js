const Joi = require("joi");
const { joiPasswordExtendCore } = require("joi-password");
const joipassword = Joi.extend(joiPasswordExtendCore);

const addMovieValidation = Joi.object({
  title: Joi.string().min(3).max(100).required(),
  description: Joi.string().min(3).max(5000).required(),
  poster_api: Joi.string().min(1).max(2000).required(),
  movie_type: Joi.string().min(4).max(50).required(),
  is_released: Joi.boolean().required(),
  language: Joi.array().items(Joi.string()).min(1).required(),
  format: Joi.array().items(Joi.string()).min(1).required(),
  hour: Joi.string().max(1).required(),
  minute: Joi.string().max(2).required(),
  date: Joi.string().required(),
});

const updateMovieValidation = Joi.object().keys({
  title: Joi.string().min(3).max(100),
  description: Joi.string().min(1).max(1000),
  poster_api: Joi.string().min(1).max(2000).required(),
  movie_type: Joi.string().min(4).max(50).required(),
  is_released: Joi.boolean().required(),
  language: Joi.array().items(Joi.string()).min(1).required(),
  format: Joi.array().items(Joi.string()).min(1).required(),
  hour: Joi.string().max(1).required(),
  minute: Joi.string().max(2).required(),
  date: Joi.string().required(),
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

const addShowValidation = Joi.object().keys({
  title: Joi.string().required(),
  datetime: Joi.date().required(),
  hour: Joi.number().required(),
  minute: Joi.number().required(),
});

const updateShowValidation = Joi.object().keys({
  title: Joi.string().required(),
  datetime: Joi.date().required(),
});

const addPromocodeValidation = Joi.object().keys({
  promo_name: Joi.string().required(),
  discount: Joi.number().required(),
  expiry_date: Joi.date().required(),
  limit: Joi.number().required(),
  promocode_type: Joi.string().required(),
  active_status: Joi.boolean().required(),
  movies: Joi.array().items(Joi.string()),
});
module.exports = {
  addMovieValidation,
  updateMovieValidation,
  registerUserValidation,
  forgotPasswordValidation,
  addShowValidation,
  updateShowValidation,
  addPromocodeValidation,
};
