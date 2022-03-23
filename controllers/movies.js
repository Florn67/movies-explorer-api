const Movie = require('../models/movie');

const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const ForbiddenError = require('../errors/ForbiddenError');

const getMovies = (req, res, next) => {
  Movie.find({})
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      next(err);
    });
};

const postMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body; // получим из объекта запроса имя и описание пользовател
  const owner = req.user._id;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner,
  })
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

const deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .orFail(() => {
      throw new NotFoundError('NotFound');
    })
    .then((movie) => {
       if (movie.owner === req.user._id) {
        Movie.findByIdAndRemove(req.params.movieId)
          .then((user) => res.send({ data: user }))
          .catch((err) => {
            next(err);
          });
        }else{
          throw new ForbiddenError('Попытка удалить чужой фильм');
        }
    })

    .catch((err) => {
      next(err);
    });
};

module.exports = {
  getMovies,
  postMovie,
  deleteMovie,
};
