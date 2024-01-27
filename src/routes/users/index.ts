import { Router } from 'express';

import { UserController } from '@/controllers/UserController';
import { authMiddleware } from '@/middlewares/authMiddleware';

const userRouter = Router();

userRouter.post('/users/create', UserController.CreateUser);
userRouter.put('/users/update', authMiddleware, UserController.UpdateUser);
userRouter.get('/users/list', UserController.ListUser);

export { userRouter };
