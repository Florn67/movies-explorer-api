const express = require('express');

const { celebrate, Joi } = require('celebrate');
const { login, createUser } = require('../controllers/users');

const logingRouter = express.Router();

logingRouter.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().min(8).required(),
    }),
  }),
  login,
);
logingRouter.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30).required(),
      email: Joi.string().required().email(),
      password: Joi.string().min(8).required(),
    }),
  }),
  createUser,
);

module.exports = logingRouter;
