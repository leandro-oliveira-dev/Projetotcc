import { Router } from 'express';

import { UserController } from '@/controllers/UserController';
import { AuthController } from '@/controllers/AuthController';
import { authMiddleware } from '@/middlewares/authMiddleware';
import { ReportController } from '@/controllers/ReportController';

const userRouter = Router();

userRouter.use(authMiddleware);
userRouter.post('/users/create', UserController.CreateUser);
userRouter.put('/users/update/:userId', UserController.UpdateUser);
userRouter.get('/users/list', UserController.ListUser);
userRouter.get('/users', AuthController.CurrentUser);

userRouter.get('/users/usuario-report', ReportController.ReportUserController);

export { userRouter };
