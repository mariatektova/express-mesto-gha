/* eslint-disable no-underscore-dangle */
// eslint-disable-next-line import/no-extraneous-dependencies
const bcrypt = require('bcryptjs');
// eslint-disable-next-line import/no-extraneous-dependencies
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const { JWT_SECRET } = require('../utils/constants');

const NotFound = require('../errors/notFound');
const Conflicted = require('../errors/conflicted');
const Unauthorized = require('../errors/unauthorized');
const BadRequest = require('../errors/badRequest');

const checkUserId = (user, res) => {
  if (!user) {
    throw new NotFound('Такого id не существует');
  }
  return res.sen(user);
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .select('+password')
    .then(async (user) => {
      if (!user) {
        throw new Unauthorized('Неверные почта или пароль');
      }
      const matched = await bcrypt.compare(password, user.password);
      if (!matched) {
        throw new Unauthorized('Неверные почта или пароль');
      }
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: '7d',
      });
      return res.send({ token });
    })
    .catch(next);
};
const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(next);
};

const createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10).then((hash) => {
    User.create({
      email: req.body.email,
      password: hash,
      name: req.body.name,
      about: req.body.about,
      avatar: req.body.avatar,
    })
      .then((newUser) => {
        res.status(201).send({
          email: newUser.email,
          name: newUser.name,
          about: newUser.about,
          avatar: newUser.avatar,
        });
      })
      .catch((error) => {
        if (error.code === 11000) {
          next(
            new Conflicted('Пользователь с такой почтой уже зарегистрирвован'),
          );
        } else if (error.name === 'ValidationError') {
          next(new BadRequest('Переданы некорректные данные при создании пользователя'));
        } else {
          next(error);
        }
      });
  });
};

const getUserById = (req, res, next) => {
  const { userId } = req.params;

  User.findById(userId)
    .then((user) => checkUserId(user, res))
    .catch((error) => {
      next(error);
    });
};

const editProfile = (req, res, next) => {
  const owner = req.user._id;
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    owner,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => checkUserId(user, res))
    .catch(next);
};

const updateAvatar = (req, res, next) => {
  const owner = req.user._id;
  const avatar = req.body;

  User.findByIdAndUpdate(owner, avatar, { new: true, runValidators: true })
    .then((user) => checkUserId(user, res))
    .catch(next);
};

module.exports = {
  getUsers,
  createUser,
  login,
  getUserById,
  editProfile,
  updateAvatar,
};
