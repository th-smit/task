const Joi = require("joi");

const AddMovieValidation = Joi.object().keys({
  title: Joi.string().min(3).max(100).required(),
  description: Joi.string().min(1).max(1000).required(),
  is_released: Joi.boolean().required(),
});

const UpdateMovieValidation = Joi.object().keys({
  title: Joi.string().min(3).max(100),
  description: Joi.string().min(1).max(1000),
  is_released: Joi.boolean(),
});

module.exports = {
  AddMovieValidation,
  UpdateMovieValidation,
};
