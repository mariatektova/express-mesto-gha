const mongoose = require('mongoose');
// eslint-disable-next-line import/no-extraneous-dependencies
const isEmail = require('validator/lib/isEmail');
const { urlRegEx } = require('../utils/constants');

const userSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 30,
  },

  about: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 30,
  },

  avatar: {
    type: String,
    required: true,
    validate: {
      validator: (v) => urlRegEx.test(v),
      message: 'Формат ссылки неправильный',
    },
  },

  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v) => isEmail(v),
      message: 'Формат почты неправильный',
    },
  },

  password: {
    type: String,
    required: true,
    select: false,
  },
});

module.exports = mongoose.model('user', userSchema);
