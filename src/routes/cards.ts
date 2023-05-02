import { Router } from 'express';
import {
  getCards, createCard, deleteCardById, likeCard, dislikeCard,
} from '../controllers/cards';
import { createCardValidation, cardIdValidation } from '../validation/card';

const cardRouter = Router();

cardRouter.get('/cards', getCards);

cardRouter.delete('/cards/:cardId', cardIdValidation, deleteCardById);

cardRouter.post('/cards', createCardValidation, createCard);

cardRouter.put('/cards/:cardId/likes', cardIdValidation, likeCard);

cardRouter.delete('/cards/:cardId/likes', cardIdValidation, dislikeCard);

export default cardRouter;
