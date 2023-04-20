import { Router } from 'express';
import {
  getCards, createCard, deleteCardById, likeCard, dislikeCard,
} from '../controllers/cards';

const cardRouter = Router();

cardRouter.get('/cards', getCards);
cardRouter.delete('/cards/:cardId', deleteCardById);
cardRouter.post('/cards', createCard);
cardRouter.put('/cards/:cardId/likes', likeCard);
cardRouter.delete('/cards/:cardId/likes', dislikeCard);

export default cardRouter;
