import { Router } from 'express';

import { UserController } from '@/controllers/UserController';
import { AuthController } from '@/controllers/AuthController';
import { authMiddleware } from '@/middlewares/authMiddleware';

const userRouter = Router();

userRouter.use(authMiddleware);
userRouter.post('/users/create', UserController.CreateUser);
userRouter.put('/users/update', UserController.UpdateUser);
userRouter.get('/users/list', UserController.ListUser);
userRouter.get('/users', AuthController.CurrentUser);

export { userRouter };
