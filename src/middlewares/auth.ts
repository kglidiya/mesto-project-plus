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
    return next(new UnauthorizedError('Необходима авторизация'));
  }
  const token = authorization?.replace('Bearer ', '');
  let payload: jwt.JwtPayload;
  try {
    if (token) {
      payload = jwt.verify(token, JWT_SECRET as string) as jwt.JwtPayload;
      requestCustom.user = {
        _id: payload._id,
      };
    }
  } catch (error) {
    return next(new UnauthorizedError('Необходима авторизация'));
  }

  return next();
};

export default {};
