import { Router } from 'express';

import { UserController } from '@/controllers/UserController';

const userRouter = Router();

userRouter.post('/users/create', UserController.CreateUser);
userRouter.put('/users/update', UserController.UpdateUser);
userRouter.get('/users/list', UserController.ListUser);

export { userRouter };
