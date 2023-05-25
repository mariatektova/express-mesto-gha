/* eslint-disable no-underscore-dangle */
const Card = require('../models/card');

const BadRequest = require('../errors/badRequest');
const NotFound = require('../errors/notFound');

const checkCardId = (card, res) => {
  if (!card) {
    throw new NotFound('Карточки с таким id не существует')
  }
  return res.send(card);
};

const getCards = (res, next) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => {
      res.send(cards);
    })
    .catch(next);
};

const createCard = (req, res, next) => {
  const { _id } = req.user;
  const { name, link } = req.body;

  Card.create({ name, link, owner: _id })
    .then((newCard) => {
      res.send(newCard);
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(
          new BadRequest(
            'Данные переданы некорректно'),
        );
        next(error);
      };
    });
};

const deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  Card.deleteOne({ _id: cardId })
    .then((card) => {
      if (card.deletedCount === 0) {
        throw new NotFound('Карточки с таким id не существует');
      }
      return res.send({ message: 'Карточка удалена' });
    })
    .catch(next);
};

const putDislike = (req, res, next) => {
  const owner = req.user._id;
  const { cardId } = req.params;

  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: owner } },
    { new: true, runValidators: true },
  )
    .then((card) => checkCardId(card, res))
    .catch(next);
};

const putLike = (req, res, next) => {
  const owner = req.user._id;
  const { cardId } = req.params;

  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: owner } },
    { new: true, runValidators: true }
  )
    .then((card) => checkCardId(card, res))
    .catch(next);
};

module.exports = {
  getCards, deleteCard, putDislike, putLike, createCard,
};
