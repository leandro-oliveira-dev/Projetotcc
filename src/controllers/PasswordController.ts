import { Request, Response } from 'express';
import { prisma } from '@/database';
import { SendEmailService } from '@/services/SendEmailService';
import { PasswordService } from '@/services/PasswordService';
import { HashUser } from '@/services/HashUser';

export class PasswordController {
  static async resetPassword(request: Request, response: Response) {
    const { newPassword, token } = request.body;

    const authId = HashUser.decrypt(token);

    try {
      // Encontra o usuário com base no e-mail fornecido
      const auth = await prisma.auth.findFirst({
        where: {
          id: authId,
        },
      });

      // Verifica se o usuário existe
      if (!auth) {
        return response.status(404).json({ error: 'Usuário não encontrado' });
      }

      const generatedPassword = await PasswordService.Create(newPassword);

      // Atualiza a senha do usuário
      await prisma.auth.update({
        where: {
          id: authId,
        },
        data: {
          password: generatedPassword,
        },
      });

      return response
        .status(200)
        .json({ message: 'Senha atualizada com sucesso' });
    } catch (error) {
      console.error('Erro ao atualizar a senha:', error);
      return response.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  static async sendResetEmail(request: Request, response: Response) {
    const { email } = request.body;

    if (!email) {
      return response.status(401).json({
        message: 'dados nao informados',
      });
    }

    const auth = await prisma.auth.findFirst({
      where: {
        email,
      },
    });

    if (!auth) {
      return response.status(401).json({
        message: 'nenhum usuario encontrado',
      });
    }

    const resetPasswordUrl = PasswordService.ResetPasswordUrl(auth.id);

    const sendEmailService = new SendEmailService({
      fromEmail: 'system@bibliotecaetec.icu',
      subject: 'Alteracao de senha',
      returnToEmail: 'system@bibliotecaetec.icu',
      toEmail: email,
      html: `
        <p>Troque sua senha no link abaixo<p>
        <a href="${resetPasswordUrl}">${resetPasswordUrl}</a>
      `,
    });

    await sendEmailService.sendEmail();

    return response.sendStatus(200);
  }
}
