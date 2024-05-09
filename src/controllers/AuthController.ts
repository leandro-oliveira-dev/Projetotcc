import { prisma } from '@/database';
import { Request, Response } from 'express';
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

  /* static async recuperarSenha(req: Request, res: Response) {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Método não permitido' });
    }

    const { newPassword, email } = req.body;

    try {
      // Encontra o usuário com base no e-mail fornecido
      const user = await prisma.user.findUnique({
        where: {
          email: email as string, 
        },
      });

      // Verifica se o usuário existe
      if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }

      // Atualiza a senha do usuário
      await prisma.user.update({
        where: {
          email: email as string, 
        },
        data: {
          password: newPassword,
        },
      });

      res.status(200).json({ message: 'Senha atualizada com sucesso' });
    } catch (error) {
      console.error('Erro ao atualizar a senha:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }*/
}
