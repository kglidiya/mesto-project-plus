import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import NotFoundError from '../errors/not-found-err';
import BadRequestError from '../errors/bad-request-err';
import ConflictError from '../errors/conflict-err';
import User from '../models/user';
import { IRequestCustom, IErrorCustom } from '../types';
import { resStatus } from '../utils';

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  const {
    email, password, name, about, avatar,
  } = req.body;
  try {
    const newUser = await bcrypt
      .hash(password, 10)
      .then((hash: string) => User.create({
        email,
        password: hash,
        name,
        about,
        avatar,
      }))
      .then((user) => {
        res.status(resStatus.CREATED).send({
          email: user.email,
          name: user.name,
          about: user.about,
          avatar: user.avatar,
        });
      });
    return newUser;
  } catch (error) {
    const err = error as IErrorCustom;
    if (err.code === 11000) {
      return next(new ConflictError('Пользователь с такой почтой уже сущестует'));
    }
    return next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  try {
    const userLoggedIn = await User.findUserByCredentials(email, password).then(
      (user) => {
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET as string, {
          expiresIn: '7d',
        });
        res.cookie('jwt', token, { maxAge: 3600000 * 24 * 7, httpOnly: true }).end();
      },
    );
    return userLoggedIn;
  } catch (error) {
    return next(error);
  }
};

export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await User.find({});
    return res.status(resStatus.OK).send(users);
  } catch (error) {
    return next(error);
  }
};

export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      const error = new NotFoundError('Пользователь не найден');
      throw error;
    }
    return res.status(resStatus.OK).send(user);
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      return next(new BadRequestError('Переданы невалидные данные'));
    }
    return next(error);
  }
};

export const getUserMe = async (req: Request, res: Response, next: NextFunction) => {
  const requestCustom = req as IRequestCustom;
  try {
    const user = await User.findById(requestCustom.user._id);
    return res.status(resStatus.OK).send(user);
  } catch (error) {
    return next(error);
  }
};

export const updateUserById = async (req: Request, res: Response, next: NextFunction) => {
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
    return res.status(resStatus.OK).send(user);
  } catch (error) {
    return next(error);
  }
};

export const updateAvatarById = async (req: Request, res: Response, next: NextFunction) => {
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
    return res.status(resStatus.OK).send(user);
  } catch (error) {
    return next(error);
  }
};

export default {};
