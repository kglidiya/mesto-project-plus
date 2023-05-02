import { celebrate, Joi, Segments } from 'celebrate';
import { ID_REGEX, EMAIL_REGEX, LINK_REGEX } from '../utils';

export const getUserValidation = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    userId: Joi.string().required().pattern(ID_REGEX),
  }),
});

export const createUserValidation = celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().required().pattern(EMAIL_REGEX),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(200),
    avatar: Joi.string().pattern(LINK_REGEX),
  }),
});

export const editUserValidation = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(200),
  }),
});

export const editAvatarValidation = celebrate({
  [Segments.BODY]: Joi.object().keys({
    avatar: Joi.string().required().pattern(LINK_REGEX),
  }),
});

export const loginValidation = celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().required().pattern(EMAIL_REGEX),
    password: Joi.string().required(),
  }),
});

export default {};
