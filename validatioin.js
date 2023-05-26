const { celebrate, Joi } = require('celebrate');
const { urlRegEx } = require('./utils/constants');

const signinValidation = {
  body: Joi.object().keys({
    email: Joi.string().required().email().messages({
      'string.email': 'Введена некорректная почта',
      'any.required': 'Почта не должна быть пустой',
    }),
    password: Joi.string().required().min(8).messages({
      'string.password': 'Пароль должен быть не менее 8 символов',
      'any.required': 'Пароль не должен быть пустым',
    }),
  }),
};

const signupValidation = {
  body: Joi.object().keys({
    email: Joi.string().required().email().required()
      .messages({
        'string.email': 'Введена некорректная почта',
        'any.required': 'Почта не должна быть пустой',
      }),
    password: Joi.string().required().min(8).messages({
      'string.password': 'Пароль должен быть не менее 8 символов',
      'any.required': 'Пароль не должен быть пустым',
    }),
    name: Joi.string().required().min(2).max(30)
      .messages({
        'string.min': 'Поле "имя" не должно быть меньше 2 символов',
        'string.max': 'Поле "имя" не должно быть больше 30 символов',
        'any.required': 'Поле "имя" не должно быть пустым',
      }),
    about: Joi.string().required().min(2).max(30)
      .messages({
        'string.min': 'Поле "род деятельности" не должно быть меньше 2 символов',
        'string.max': 'Поле "род деятельности" не должно быть больше 30 символов',
        'any.required': 'Поле "род деятельности" не должно быть пустым',
      }),
    avatar: Joi.string().required().regex(urlRegEx).message('Невалидная ссылка'),
  }),
};

const getUserByIdValidation = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().length(24).hex().required(),
  }),
});

const editProfileValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
});

const updateAvatarValidation = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(urlRegEx).required(),
  }),
});

const createCardValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(urlRegEx),
  }),
});

const deleteCardValidation = {
  params: Joi.object({
    cardId: Joi.string().hex().length(24).required()
      .messages({
        'string.hex': 'Некорректный id',
      }),
  }),
};

const likeCardValidation = {
  params: Joi.object({
    cardId: Joi.string().hex().length(24).required()
      .messages({
        'string.hex': 'Некорректный id',
      }),
  }),
};

module.exports = {
  getUserByIdValidation,
  editProfileValidation,
  updateAvatarValidation,
  signinValidation,
  signupValidation,
  createCardValidation,
  deleteCardValidation,
  likeCardValidation,
};
