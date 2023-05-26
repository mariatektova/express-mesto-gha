/* eslint-disable no-underscore-dangle */
const Card = require('../models/card');

const BadRequest = require('../errors/badRequest');
const NotFound = require('../errors/notFound');
const Forbidden = require('../errors/forbidden');

const checkCardId = (card, res) => {
  if (!card) {
    throw new NotFound('Карточки с таким id не существует');
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
            'Данные переданы некорректны'
          )
        );
      } else {
        next(error);
      }
    });
};

const deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  const idUser = req.user._id;
  Card.findById(cardId)
    .then((cardFind) => {
      if (!cardFind) {
        const err = new NotFound('Карточки с таким id не существует');
        next(err);
        return;
      }
      const idOwner = cardFind.owner.toString();
      if (idOwner === idUser) {
        cardFind.deleteOne()
          .then(res.send({ message: 'Карточка удалена' }))
          .catch((err) => {
            next(err);
          });
      } else {
        const err = new Forbidden('Чужую карточку удалить нельзя');
        next(err);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        const error = new NotFound('Некорректные данные');
        next(error);
      } else {
        next(err);
      }
    });
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
    { new: true, runValidators: true },
  )
    .then((card) => checkCardId(card, res))
    .catch(next);
};

module.exports = {
  getCards, deleteCard, putDislike, putLike, createCard,
};
