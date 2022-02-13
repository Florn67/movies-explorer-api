const express = require('express');
const { errors } = require('celebrate');
const { requestLogger, errorLogger } = require('../middlewares/logger');
const auth = require('../middlewares/auth');
const NotFoundError = require('../errors/NotFoundError');

const routes = express.Router();
const router = require('./users');
const movieRouter = require('./movies');
const logingRouter = require('./loging');

routes.use(requestLogger);

routes.use(logingRouter);
routes.use(auth);

routes.use(router);
routes.use(movieRouter);

routes.use(() => {
  throw new NotFoundError('Такого запроса не существует');
});
routes.use(errorLogger);

routes.use(errors());

routes.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = statusCode === 500
    ? ('На сервере произошла ошибка', err.message)
    : err.message;
  res.status(statusCode).send({ message, err });
  next();
});

module.exports = routes;
