import * as dotenv from 'dotenv';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { IRequestCustom } from '../types';
import UnauthorizedError from '../errors/unauthorized-err';

dotenv.config();

const { JWT_SECRET } = process.env;

export const auth = (req: Request, res: Response, next: NextFunction) => {
  const requestCustom = req as IRequestCustom;
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    const error = new UnauthorizedError('Необходима авторизация');
    throw error;
  }
  const token = authorization.replace('Bearer ', '');
  let payload: jwt.JwtPayload;
  try {
    payload = jwt.verify(token, JWT_SECRET as string) as jwt.JwtPayload;
  } catch (error) {
    return next(error);
  }

  requestCustom.user = {
    _id: payload._id,
  };

  return next();
};

export default {};
