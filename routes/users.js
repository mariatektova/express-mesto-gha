const usersRouter = require('express').Router();
const { celebrate } = require('celebrate');
const {
  getUserByIdValidation,
  editProfileValidation,
  updateAvatarValidation,
} = require('../validatioin');

const {
  getUsers,
  getUserById,
  editProfile,
  updateAvatar,
  createUser,
} = require('../controllers/users');

usersRouter.get('/', getUsers);
usersRouter.get('/:userId', celebrate(getUserByIdValidation), getUserById);

usersRouter.patch('/me', celebrate(editProfileValidation), editProfile);
usersRouter.patch('/me/avatar', celebrate(updateAvatarValidation), updateAvatar);

usersRouter.post('/', createUser);

module.exports = usersRouter;
