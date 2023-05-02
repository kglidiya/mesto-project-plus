import { Router } from 'express';
import {
  getUsers, getUserById, updateUserById, updateAvatarById, getUserMe,
} from '../controllers/users';
import {
  getUserValidation, editUserValidation, editAvatarValidation,
} from '../validation/user';

const userRouter = Router();

userRouter.get('/users', getUsers);

userRouter.get('/users/me', getUserMe);

userRouter.get('/users/:userId', getUserValidation, getUserById);

userRouter.patch('/users/me', editUserValidation, updateUserById);

userRouter.patch('/users/me/avatar', editAvatarValidation, updateAvatarById);

export default userRouter;
