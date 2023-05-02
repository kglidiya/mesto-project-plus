import { celebrate, Joi, Segments } from 'celebrate';
import { ID_REGEX, LINK_REGEX } from '../utils';

export const cardIdValidation = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    cardId: Joi.string().required().pattern(ID_REGEX),
  }),
});

export const createCardValidation = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(LINK_REGEX),
  }),
});

export default {};
