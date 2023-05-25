const cardsRouter = require('express').Router();
const { celebrate } = require('celebrate');
const { createCardValidation, deleteCardValidation, likeCardValidation } = require('../validatioin');

const {
  createCard,
  getCards,
  deleteCard,
  putLike,
  putDislike,
} = require('../controllers/cards');

cardsRouter.get('/', getCards);
cardsRouter.post('/', celebrate(createCardValidation), createCard);
cardsRouter.put('/:cardId/likes', putLike);
cardsRouter.delete('/:cardId/likes', celebrate(likeCardValidation), putDislike);
cardsRouter.delete('/:cardId', celebrate(deleteCardValidation), deleteCard);

module.exports = cardsRouter;
