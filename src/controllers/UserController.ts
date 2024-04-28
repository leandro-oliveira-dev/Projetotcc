/* eslint-disable prettier/prettier */
import { Request, Response } from 'express';

import { prisma } from '@/database';
import { PasswordController } from './PasswordController';
import { AuthenticatedRequest } from '@/middlewares/authMiddleware';

interface IFindUsers {
  where?: {
    name?: {
      contains: string;
    };
  };
  userId?: string;
  skip: number;
  take: number;
}

export class UserController {
  static async CreateUser(request: Request, response: Response) {
    const { name, email, ra, password, isAdmin } = request.body;

    const userAuthExist = await prisma.auth.findUnique({
      where: { email, ra },
    });

    if (userAuthExist) {
      return response.status(400).json({
        message: 'Error: Usuário já existe!',
      });
    }

    const generatedPassword = await PasswordController.Create(password);

    if (!generatedPassword) {
      return response.status(400).json({
        message: 'Falha ao gerar senha!',
      });
    }

    const createdUser = await prisma.user.create({
      data: {
        name,
        isAdmin,
        auth: {
          create: {
            email,
            password: generatedPassword,
            ra,
          },
        },
      },
    });

    const user = await prisma.user.findFirst({
      where: {
        id: createdUser.id,
      },
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

    return response.json({
      message: 'Sucesso: Usuário cadastrado com sucesso!',
      user,
    });
  }

  static async ListUser(request: Request, response: Response) {
    const { page = 1, pageSize = 10, name } = request.query;
    const pageNumber = parseInt(page as string, 10);
    const pageSizeNumber = parseInt(pageSize as string, 10);

    const skip = (pageNumber - 1) * pageSizeNumber;
    const take = pageSizeNumber;
    const totalUsers = await prisma.user.count();
    const totalPages = Math.ceil(totalUsers / pageSizeNumber);

    const hasPreviousPage = pageNumber > 1;
    const hasNextPage = pageNumber < totalPages;

    const users = await prisma.user.findMany({
      where: {
        ...(name && { name: { contains: String(name) } }),
      },
      orderBy: {
        created_at: 'desc',
      },
      include: {
        auth: {
          select: {
            email: true,
            ra: true,
            password: true,
          },
        },
      },
      skip,
      take,
    });

    return response.json({
      users,
      totalUsers,
      totalPages,
      hasPreviousPage,
      hasNextPage,
    });
  }

  static async UpdateUser(request: Request, response: Response) {
    const { name, ra, email } = request.body;
    const { userId } = request.params;

    const userExist = await prisma.user.findFirst({
      where: {
        id: userId,
      },
    });

    if (!userExist) {
      return response.status(400).json({
        message: 'Error: Usuario nao existe!',
      });
    }

    const user = await prisma.user.update({
      where: {
        id: userId,
      },
      select: {
        name: true,
        enabled: true,
        isAdmin: true,
        created_at: true,
        id: true,
        auth: {
          select: {
            email: true,
            ra: true,
          },
        },
      },
      data: {
        name,
        auth: {
          update: {
            email,
            ra,
          },
        },
      },
    });

    return response.json({
      message: 'Usuario atualizado com sucesso',
      user,
    });
  }

  static async DisableUser(request: Request, response: Response) {
    const { userId } = request.params;

    await prisma.user.update({
      where: { id: userId },
      data: { enabled: false },
    });

    return response.sendStatus(204);
  }

  static async EnableUser(request: Request, response: Response) {
    const { userId } = request.params;

    await prisma.user.update({
      where: { id: userId },
      data: { enabled: true },
    });

    return response.sendStatus(204);
  }

  // Função para encontrar usuários com base em critérios de pesquisa
  static async findAllUsers({ skip, take, where }: IFindUsers) {
    const selectedUsers = await prisma.user.findMany({
      where: {
        name: {
          contains: String(where?.name), // Pesquisa por nome
        },
      },

      skip,
      take,
    });

    return selectedUsers;
  }
}
