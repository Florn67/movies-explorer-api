const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const NotFoundError = require('../errors/NotFoundError');
const ConflictError = require('../errors/ConflictError');
const BadRequestError = require('../errors/BadRequestError');
const UnauthorizedError = require('../errors/UnauthorizedError');

const { NODE_ENV, JWT_SECRET } = process.env;

const getUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => {
      throw new Error('NotFound');
    })
    .then((user) => res.send({ data: user }))
    .catch(() => {
      next(new NotFoundError('Неправильный id пользователя'));
    });
};

const patchProfile = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(
          new BadRequestError(
            'Переданы некорректные данные в методы, либо id не валиден',
          ),
        );
      } else {
        next(err);
      }
    });
};

const createUser = (req, res, next) => {
  const { name, email, password } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => {
      User.create({
        name,
        email,
        password: hash,
      })
        .then(() => res.status(200).send(
          {
            data:
          {
            name,
            email,
          },
          },
        ))
        .catch((err) => {
          if (err.code === 11000) {
            next(
              new ConflictError(
                'При регистрации указан email, который уже существует на сервере'
              ),
            );
          } else if (err.name === 'ValidationError') {
            next(
              new BadRequestError(
                'Переданы некорректные данные в методы, либо id не валиден'
              ),
            );
          } else {
            next(err);
          }
        });
    })
    .catch((err) => {
      next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError('Неправильные почта или пароль');
      }
      return Promise.all([bcrypt.compare(password, user.password), user]);
    })
    .then((arr) => {
      const matched = arr[0];
      const user = arr[1];
      if (!matched) {
        throw new UnauthorizedError('Неправильные почта или пароль');
      }
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );
      return res.send({ token });
    })

    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(
          new BadRequestError(
            'Переданы некорректные данные в методы, либо id не валиден',
          ),
        );
      } else {
        next(err);
      }
    });
};

module.exports = {
  getUser,
  patchProfile,
  createUser,
  login,
};
