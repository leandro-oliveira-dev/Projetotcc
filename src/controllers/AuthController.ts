import { prisma } from '@/database';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

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
}
