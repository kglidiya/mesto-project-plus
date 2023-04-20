import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Card from '../models/card';
import { IRequestCustom } from '../types';
import errorStatus from '../utils';

export const getCards = async (req: Request, res: Response) => {
  try {
    const cards = await Card.find({});
    return res.status(errorStatus.OK).send(cards);
  } catch (error) {
    return res
      .status(errorStatus.INTERNAL_SERVER_ERROR)
      .send({ message: 'Ошибка на стороне сервера' });
  }
};

export const createCard = async (req: Request, res: Response) => {
  const requestCustom = req as IRequestCustom;
  try {
    const { name, link } = req.body;
    if (!name || !link) {
      const error = new Error('Заполнены не все обязательны поля');
      error.name = 'CustomValid';
      throw error;
    }
    const newCard = await Card.create({
      ...req.body,
      owner: requestCustom.user._id,
    });
    return res.status(errorStatus.CREATED).send(newCard);
  } catch (error) {
    if (error instanceof Error && error.name === 'CustomValid') {
      return res
        .status(errorStatus.BAD_REQUEST)
        .send({ message: error.message });
    }
    if (error instanceof mongoose.Error.ValidationError) {
      return res
        .status(errorStatus.BAD_REQUEST)
        .send({ message: 'Переданы некорректные данные' });
    }
    return res
      .status(errorStatus.INTERNAL_SERVER_ERROR)
      .send({ message: 'Ошибка на стороне сервера' });
  }
};

export const deleteCardById = async (req: Request, res: Response) => {
  try {
    const card = await Card.findByIdAndRemove(req.params.cardId);
    if (!card) {
      const error = new Error('Такой карточки не существует');
      error.name = 'NotFound';
      throw error;
    }
    return res.status(errorStatus.OK).send(card);
  } catch (error) {
    if (error instanceof Error && error.name === 'NotFound') {
      return res.status(errorStatus.NOT_FOUND).send({ message: error.message });
    }
    if (error instanceof mongoose.Error.CastError) {
      return res
        .status(errorStatus.BAD_REQUEST)
        .send({ message: 'Переданы некорректные данные' });
    }
    return res
      .status(errorStatus.INTERNAL_SERVER_ERROR)
      .send({ message: 'Ошибка на стороне сервера' });
  }
};

export const likeCard = async (req: Request, res: Response) => {
  try {
    const requestCustom = req as IRequestCustom;
    const likes = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: requestCustom.user._id } },
      { new: true },
    );
    return res.status(errorStatus.OK).send(likes);
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      return res
        .status(errorStatus.BAD_REQUEST)
        .send({ message: 'Переданы некорректные данные' });
    }
    return res
      .status(errorStatus.INTERNAL_SERVER_ERROR)
      .send({ message: 'Ошибка на стороне сервера' });
  }
};

export const dislikeCard = async (req: Request, res: Response) => {
  const requestCustom = req as IRequestCustom;
  try {
    const likes = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: requestCustom.user._id } },
      { new: true },
    );
    return res.status(errorStatus.OK).send(likes);
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      return res
        .status(errorStatus.BAD_REQUEST)
        .send({ message: 'Переданы некорректные данные' });
    }
    return res
      .status(errorStatus.INTERNAL_SERVER_ERROR)
      .send({ message: 'Ошибка на стороне сервера' });
  }
};

export default {};
