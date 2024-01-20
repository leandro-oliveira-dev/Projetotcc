/* eslint-disable prettier/prettier */
import { Request, Response } from 'express';

import { prisma } from '@/database';

export class UserController {
  static async CreateUser(request: Request, response: Response) {
    const { name, email, ra } = request.body;

    const userExist = await prisma.user.findUnique({ where: { email, ra } });

    if (userExist) {
      return response.status(400).json({
        message: 'Error: Usuário já existe!',
      });
    }

    const user = await prisma.user.create({
      data: {
        name,
        email,
        ra,
      },
    });

    return response.json({
      message: 'Sucesso: Usuário cadastrado com sucesso!',
      user,
    });
  }

  static async ListUser(request: Request, response: Response) {
    const users = await prisma.user.findMany();

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
