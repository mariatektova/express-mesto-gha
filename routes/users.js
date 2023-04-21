const usersRouter = require('express').Router();
const {
  getUsers,
  getUserById,
  editProfile,
  updateAvatar,
  createUser,
} = require('../controllers/users');

usersRouter.get('/', getUsers);
usersRouter.get('/:userId', getUserById);

usersRouter.patch('/me', editProfile);
usersRouter.patch('/me/avatar', updateAvatar);

usersRouter.post('/', createUser);

module.exports = usersRouter;
