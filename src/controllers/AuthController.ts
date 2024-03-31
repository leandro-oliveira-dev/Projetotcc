import { prisma } from '@/database';
import { Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { AuthenticatedRequest } from '@/middlewares/authMiddleware';

interface SignParams {
  email: string;
  ra: string;
  password: string;
}

export class AuthController {
  static async Sign({ email, ra, password }: SignParams) {
    const auth = await prisma.auth.findFirst({
      include: {
        user: true,
      },
      where: {
        user: {
          enabled: true,
        },
        email,
        ra,
      },
    });

    if (!auth) return undefined;

    const allowedToLogin = await bcrypt.compare(password, auth.password);

    if (!allowedToLogin) return undefined;

    const token = jwt.sign(
      { userId: auth.user.id },
      String(process.env.SECRET_KEY),
      {
        expiresIn: '30d',
      }
    );

    return { auth, token };
  }

  static async CurrentUser(request: AuthenticatedRequest, response: Response) {
    if (!request.authenticated?.userId) return response.sendStatus(400);

    const user = await prisma.user.findFirst({
      include: {
        auth: {
          select: {
            email: true,
            ra: true,
          },
        },
      },
      where: {
        id: request.authenticated?.userId,
        enabled: true,
      },
    });

    return response.json(user);
  }
}
