import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';

export interface IRequestCustom extends Request {
  user: {_id: JwtPayload}
}

export interface IErrorCustom extends Error{
  statusCode: number;
}
