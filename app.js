require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const routes = require('./routes/index');
const allowedCors = ['localhost:3000'];
const app = express();

const { PORT = 3001 } = process.env;

const whitelist = ['http://localhost:3000', 'http://http://movies-explorer-frontend.nomoredomains.work/'];
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}
app.use(bodyParser.json());

const { NODE_ENV, MONGO_ADRES } = process.env;
if (NODE_ENV !== 'production') {
  mongoose
    .connect('mongodb://localhost:27017/bitfilmsdb', {
      useNewUrlParser: true,
    })
    .catch((error) => {
      console.log('Ошибка в коннекте', error);
    });
} else {
  mongoose
    .connect(MONGO_ADRES, {
      useNewUrlParser: true,
    })
    .catch((error) => {
      console.log('Ошибка в коннекте', error);
    });
}
// app.use((req, res, next) => {
//   const { origin } = req.headers; // Сохраняем источник запроса в переменную origin
//   // проверяем, что источник запроса есть среди разрешённых
//   console.log('origin :>> ', origin);
//   if (allowedCors.includes(origin)) {
//     // устанавливаем заголовок, который разрешает браузеру запросы с этого источника
//     res.header('Access-Control-Allow-Origin', origin);

//   }

//   const { method } = req; // Сохраняем тип запроса (HTTP-метод) в соответствующую переменную

//   // Значение для заголовка Access-Control-Allow-Methods по умолчанию (разрешены все типы запросов)
//   const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';
//   const requestHeaders = req.headers['access-control-request-headers'];
//   // Если это предварительный запрос, добавляем нужные заголовки
//   if (method === 'OPTIONS') {
//     // разрешаем кросс-доменные запросы любых типов (по умолчанию)
//     res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
//     res.header('Access-Control-Allow-Headers', requestHeaders);
//     // завершаем обработку запроса и возвращаем результат клиенту
//     return origin;
//   }

//   next();
// });
app.use(cors());
app.use(routes);

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
