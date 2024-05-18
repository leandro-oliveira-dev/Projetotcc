import { PasswordController } from '@/controllers/PasswordController';
import { Router } from 'express';

const passwordRouter = Router();

passwordRouter.post(
  '/password/reset/send/email',
  PasswordController.sendResetEmail
);

passwordRouter.put('/password/reset', PasswordController.resetPassword);

export { passwordRouter };
