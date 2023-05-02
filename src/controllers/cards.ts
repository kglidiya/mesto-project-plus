import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import Card from '../models/card';
import { IRequestCustom } from '../types';
import { resStatus } from '../utils';
import NotFoundError from '../errors/not-found-err';
import ForbiddenError from '../errors/forbidden';
import BadRequestError from '../errors/bad-request-err';

export const getCards = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cards = await Card.find({}).populate(['owner', 'likes']);
    return res.status(resStatus.OK).send(cards);
  } catch (error) {
    return next(error);
  }
};

export const createCard = async (req: Request, res: Response, next: NextFunction) => {
  const requestCustom = req as IRequestCustom;
  try {
    const newCard = await Card.create({
      ...req.body,
      owner: requestCustom.user._id,
      runValidators: true,
    });
    return res.status(resStatus.CREATED).send(newCard);
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return next(new BadRequestError('Переданы некорректные данные'));
    }
    return next(error);
  }
};

export const deleteCardById = async (req: Request, res: Response, next: NextFunction) => {
  const requestCustom = req as IRequestCustom;
  try {
    const card = await Card.findById({
      _id: req.params.cardId,
    }).populate(['owner', 'likes']) as any;
    if (!card) {
      const error = new NotFoundError('Такой карточки не существует');
      throw error;
    }
    let cardToDelete;
    if (String(card.owner._id) === String(requestCustom.user._id)) {
      cardToDelete = await Card.findByIdAndRemove({
        _id: req.params.cardId,
      });
    }
    if (!cardToDelete) {
      const error = new ForbiddenError('У Вас нет прав на удаление данной карточки');
      throw error;
    }
    return res.status(resStatus.OK).send(cardToDelete);
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      return next(new BadRequestError('Переданы невалидные данные'));
    }
    return next(error);
  }
};

export const likeCard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const requestCustom = req as IRequestCustom;
    const likes = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: requestCustom.user._id } },
      { new: true },
    ).populate(['owner', 'likes']);
    if (!likes) {
      const error = new NotFoundError('Такой карточки не существует');
      throw error;
    }
    return res.status(resStatus.OK).send(likes);
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      return next(new BadRequestError('Переданы невалидные данные'));
    }
    return next(error);
  }
};

export const dislikeCard = async (req: Request, res: Response, next: NextFunction) => {
  const requestCustom = req as IRequestCustom;
  try {
    const likes = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: requestCustom.user._id } },
      { new: true },
    ).populate(['owner', 'likes']);
    if (!likes) {
      const error = new NotFoundError('Такой карточки не существует');
      throw error;
    }
    return res.status(resStatus.OK).send(likes);
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      return next(new BadRequestError('Переданы невалидные данные'));
    }
    return next(error);
  }
};

export default {};
