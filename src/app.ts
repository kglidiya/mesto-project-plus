import * as dotenv from 'dotenv';
import express, {
  Request,
  Response,
  RequestHandler,
  NextFunction,
} from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import { errors } from 'celebrate';
import path from 'path';
import cardRouter from './routes/cards';
import userRouter from './routes/users';
import { login, createUser } from './controllers/users';
import { auth } from './middlewares/auth';
import { requestLogger, errorLogger } from './middlewares/logger';
import { IErrorCustom } from './types';
import NotFoundError from './errors/not-found-err';
import { createUserValidation, loginValidation } from './validation/user';

dotenv.config({ path: path.join(__dirname, '..', '.env') });
const { PORT = 3000 } = process.env;
const app = express();
app.use(express.urlencoded({ extended: true }) as RequestHandler);
app.use(cookieParser());
app.use(express.json() as RequestHandler);
app.use(requestLogger);

app.post('/signup', createUserValidation, createUser);

app.post('/signin', loginValidation, login);

app.use(auth);

app.use(userRouter);
app.use(cardRouter);

app.use((req: Request, res: Response, next: NextFunction) => {
  next(new NotFoundError('Несуществующий роут'));
});

app.use(errorLogger);

app.use(errors());

// eslint-disable-next-line no-unused-vars
app.use((err: IErrorCustom, req: Request, res: Response, next: NextFunction) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
});

async function connect() {
  try {
    mongoose.set('strictQuery', true);
    await app.listen(PORT, () => {
      console.log('Server listeting on port', PORT);
    });
    await mongoose.connect('mongodb://localhost:27017/mestodb');
  } catch (error) {
    if (error instanceof mongoose.Error.MongooseServerSelectionError) {
      console.log('Ошибка подключения к базе данных');
    }
    console.log('Ошибка запуска сервера', error);
  }
}

connect();
