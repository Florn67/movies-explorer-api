const express = require('express');
const { celebrate, Joi } = require('celebrate');
const { getUser, patchProfile } = require('../controllers/users');

const router = express.Router();

router.get('/users/me', getUser);
router.patch(
  '/users/me',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      name: Joi.string().min(2).max(30).required(),
    }),
  }),
  patchProfile,
);

module.exports = router;
