const authRouter = require('express').Router();
const { celebrate } = require('celebrate');
const { login, createUser } = require('../controllers/users');
const { signinValidation, signupValidation } = require('../validatioin');

authRouter.post('/sign-in', celebrate(signinValidation), login);
authRouter.post('/sign-up', celebrate(signupValidation), createUser);

module.exports = authRouter;
