import { Request, Response } from 'express';
import mongoose from 'mongoose';
import User from '../models/user';
import { IRequestCustom } from '../types';
import errorStatus from '../utils';

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find({});
    return res.status(errorStatus.OK).send(users);
  } catch (error) {
    return res
      .status(errorStatus.INTERNAL_SERVER_ERROR)
      .send({ message: 'Ошибка на стороне сервера' });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      const error = new Error('Пользователь не найден');
      error.name = 'NotFound';
      throw error;
    }
    return res.status(errorStatus.OK).send(user);
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

export const createUser = async (req: Request, res: Response) => {
  try {
    const newUser = await User.create(req.body);
    return res.status(errorStatus.CREATED).send(newUser);
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return res
        .status(errorStatus.BAD_REQUEST)
        .send({ message: 'Переданы некорректные или неполные данные' });
    }
    return res
      .status(errorStatus.INTERNAL_SERVER_ERROR)
      .send({ message: 'Ошибка на стороне сервера' });
  }
};

export const updateUserById = async (req: Request, res: Response) => {
  const requestCustom = req as IRequestCustom;
  try {
    const user = await User.findByIdAndUpdate(
      requestCustom.user._id,
      req.body,
      {
        new: true,
        runValidators: true,
      },
    );
    return res.status(errorStatus.OK).send(user);
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      return res
        .status(errorStatus.BAD_REQUEST)
        .send({ message: 'Переданы некорректные данные' });
    }
    if (error instanceof mongoose.Error.ValidationError) {
      return res
        .status(errorStatus.BAD_REQUEST)
        .send({ message: 'Переданы невалидные данные' });
    }
    return res
      .status(errorStatus.INTERNAL_SERVER_ERROR)
      .send({ message: 'Ошибка на стороне сервера' });
  }
};

export const updateAvatarById = async (req: Request, res: Response) => {
  try {
    const requestCustom = req as IRequestCustom;
    const user = await User.findByIdAndUpdate(
      requestCustom.user._id,
      req.body,
      {
        new: true,
        runValidators: true,
      },
    );
    return res.status(errorStatus.OK).send(user);
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      return res
        .status(errorStatus.BAD_REQUEST)
        .send({ message: 'Переданы некорректные данные' });
    }
    if (error instanceof mongoose.Error.ValidationError) {
      return res
        .status(errorStatus.BAD_REQUEST)
        .send({ message: 'Переданы невалидные данные' });
    }
    return res
      .status(errorStatus.INTERNAL_SERVER_ERROR)
      .send({ message: 'Ошибка на стороне сервера' });
  }
};

export default {};
