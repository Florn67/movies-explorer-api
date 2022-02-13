require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const bodyParser = require('body-parser');
const routes = require('./routes/index');

const app = express();

const { PORT = 3000 } = process.env;
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

app.use(routes);

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
