import { PasswordController } from '@/controllers/PasswordController';
import { Router } from 'express';

const passwordRouter = Router();

passwordRouter.post(
  '/password/reset/send/email',
  PasswordController.sendResetEmail
);

passwordRouter.post('/password/reset', PasswordController.reset);

export { passwordRouter };
