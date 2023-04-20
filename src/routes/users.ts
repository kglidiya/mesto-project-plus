import { Router } from 'express';
import {
  getUsers, getUserById, createUser, updateUserById, updateAvatarById,
} from '../controllers/users';

const userRouter = Router();

userRouter.get('/users', getUsers);
userRouter.get('/users/:userId', getUserById);
userRouter.post('/users', createUser);
userRouter.patch('/users/me', updateUserById);
userRouter.patch('/users/me/avatar', updateAvatarById);

export default userRouter;
