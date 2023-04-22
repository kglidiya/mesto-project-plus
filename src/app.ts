import '../env';
import express, { Request, Response, RequestHandler } from 'express';
import mongoose from 'mongoose';
import errorStatus from './utils';
import { IRequestCustom } from './types';
import cardRouter from './routes/cards';
import userRouter from './routes/users';

const { PORT = 3000 } = process.env;

const app = express();
app.use(express.urlencoded({ extended: true }) as RequestHandler);
app.use(express.json() as RequestHandler);
app.use((req: Request, res: Response, next) => {
  const requestCustom = req as IRequestCustom;
  requestCustom.user = {
    _id: '6440d879eb9a43b2d9087fb5',
  };
  next();
});

app.use(userRouter);
app.use(cardRouter);
app.use((req: Request, res: Response) => {
  res
    .status(errorStatus.BAD_REQUEST)
    .send({ message: 'Несуществующий роут' });
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
