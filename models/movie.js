const mongoose = require('mongoose');
const validator = require('validator');
function validateUrl(url) {
  return validator.isURL(url);
}

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
  },
  director: {
    type: String,
    require: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
    validate: [validateUrl, 'Please fill a valid link'],
  },
  trailerLink: {
    type: String,
    required: true,
    validate: [validateUrl, 'Please fill a valid link'],
  },
  thumbnail: {
    type: String,
    required: true,
    validate: [validateUrl, 'Please fill a valid link'],
  },
  owner: {
    type: String,
    required: true,
  },
  movieId: {
    type: Number,
    required: true,
  },
  nameRU: {
    type: String,
    required: true,
  },
  nameEN: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('movie', movieSchema);
