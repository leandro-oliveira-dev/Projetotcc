/* eslint-disable prettier/prettier */
import { Request, Response } from 'express';

import { prisma } from '@/database';
import { PasswordController } from './PasswordController';

export class UserController {
  static async CreateUser(request: Request, response: Response) {
    const { name, email, ra } = request.body;

    const userAuthExist = await prisma.auth.findUnique({
      where: { email, ra },
    });

    if (userAuthExist) {
      return response.status(400).json({
        message: 'Error: Usuário já existe!',
      });
    }

    const password = await PasswordController.Create('1234');

    if (!password) {
      return response.status(400).json({
        message: 'Falha ao gerar senha!',
      });
    }

    const user = await prisma.user.create({
      data: {
        name,
        auth: {
          create: {
            email,
            password,
            ra,
          },
        },
      },
    });

    return response.json({
      message: 'Sucesso: Usuário cadastrado com sucesso!',
      user,
    });
  }

  static async ListUser(request: Request, response: Response) {
    const users = await prisma.user.findMany({
      include: {
        auth: {
          select: {
            email: true,
            ra: true,
            password: true,
          },
        },
      },
    });

    return response.json(users);
  }

  static async UpdateUser(request: Request, response: Response) {
    const { id, name, email, enabled } = request.body;

    const userExist = await prisma.user.findFirst({
      where: {
        id,
      },
    });

    if (!userExist) {
      return response.status(400).json({
        message: 'Error: Usuario nao existe!',
      });
    }

    // spread operator
    const userData = {
      ...(name && { name }),
      ...(email && { email }),
      ...(enabled !== undefined && { enabled }),
    };

    await prisma.user.update({
      where: {
        id,
      },
      data: userData,
    });

    return response.json({
      message: 'Usuario atualizado com sucesso',
    });
  }
}
