const cardsRouter = require('express').Router();

const {
  createCard,
  getCards,
  deleteCard,
  putLike,
  putDislike,
} = require('../controllers/cards');

cardsRouter.get('/', getCards);
cardsRouter.post('/', createCard);
cardsRouter.put('/:cardId/likes', putLike);
cardsRouter.delete('/:cardId/likes', putDislike);
cardsRouter.delete('/:cardId', deleteCard);

module.exports = cardsRouter;
