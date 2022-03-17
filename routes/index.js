const express = require('express');
const { errors } = require('celebrate');
const { requestLogger, errorLogger } = require('../middlewares/logger');
const auth = require('../middlewares/auth');
const NotFoundError = require('../errors/NotFoundError');
const allowedCors = ['localhost:3000'];
const routes = express.Router();
const router = require('./users');
const movieRouter = require('./movies');
const logingRouter = require('./loging');

routes.use(requestLogger);

router.use((req, res, next) => {
  const { origin } = req.headers; // Сохраняем источник запроса в переменную origin
  // проверяем, что источник запроса есть среди разрешённых
  if (allowedCors.includes(origin)) {
    // устанавливаем заголовок, который разрешает браузеру запросы с этого источника
    res.header('Access-Control-Allow-Origin', origin);
  }

  const { method } = req; // Сохраняем тип запроса (HTTP-метод) в соответствующую переменную

  // Значение для заголовка Access-Control-Allow-Methods по умолчанию (разрешены все типы запросов)
  const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';
  const requestHeaders = req.headers['access-control-request-headers'];
  // Если это предварительный запрос, добавляем нужные заголовки
  if (method === 'OPTIONS') {
    // разрешаем кросс-доменные запросы любых типов (по умолчанию)
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    res.header('Access-Control-Allow-Headers', requestHeaders);
    // завершаем обработку запроса и возвращаем результат клиенту
    return res.end();
  }

  next();
});

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
