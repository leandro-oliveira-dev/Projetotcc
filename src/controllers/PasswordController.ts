import { Request, Response } from 'express';
import { prisma } from '@/database';

export class PasswordController {
  static async reset(request: Request, response: Response) {
    const { newPassword, email } = request.body;

    try {
      // Encontra o usuário com base no e-mail fornecido
      const auth = await prisma.auth.findFirst({
        where: {
          email,
        },
      });

      // Verifica se o usuário existe
      if (!auth) {
        return response.status(404).json({ error: 'Usuário não encontrado' });
      }

      // Atualiza a senha do usuário
      await prisma.auth.update({
        where: {
          email: email,
        },
        data: {
          password: newPassword,
        },
      });

      response.status(200).json({ message: 'Senha atualizada com sucesso' });
    } catch (error) {
      console.error('Erro ao atualizar a senha:', error);
      response.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  static async sendResetEmail(request: Request, response: Response) {
    return response.sendStatus(200);
  }
}
