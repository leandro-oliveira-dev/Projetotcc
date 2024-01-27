import { AuthController } from '@/controllers/AuthController';
import { Router, Request, Response } from 'express';

const authRouter = Router();

authRouter.post('/auth', async (request: Request, response: Response) => {
  const { email, ra, password } = request.body;

  const auth = await AuthController.Sign({ email, ra, password });

  if (!auth) {
    return response.status(401).json({
      message: 'email, ra ou senha invalidos',
    });
  }

  return response.json(auth);
});

export { authRouter };
