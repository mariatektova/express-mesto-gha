/* eslint-disable import/no-unresolved */
const usersRouter = require('express').Router();
const { celebrate } = require('celebrate');
const { getUserByIdValidation, editProfileValidation, updateAvatarValidation } = require('../validatioin');

const {
  getUsers,
  getUserById,
  editProfile,
  updateAvatar,
} = require('../controllers/users');

usersRouter.get('/', getUsers);
usersRouter.get('/:userId', celebrate(getUserByIdValidation), getUserById);

usersRouter.patch('/me', celebrate(editProfileValidation), editProfile);
usersRouter.patch('/me/avatar', celebrate(updateAvatarValidation), updateAvatar);

module.exports = usersRouter;
