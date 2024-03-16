import { Request, Response } from 'express';

import { prisma } from '@/database';

export class BorrowBookController {
  public static async CreateBorrowBook(request: Request, response: Response) {
    try {
      const { userId } = request.body;
      const { bookId } = request.params;

      // Verificar se o livro existe
      const book = await prisma.book.findFirst({
        where: {
          id: bookId,
          BorrowedBook: {
            none: {
              userId,
            },
          },
        },
        include: {
          BorrowedBook: {
            select: {
              id: true,
              userId: true,
            },
          },
        },
      });

      if (!book) {
        return response.status(404).json({
          message: 'Livro não encontrado, ou ja emprestado!',
        });
      }

      // Verificar se o livro está disponível para empréstimo
      if (book.status !== 'disponivel' && book.status !== 'emprestado') {
        return response.status(400).json({
          message: 'Livro não disponível para empréstimo!',
        });
      }

      const borrowedBookCount = await prisma.borrowedBook.count({
        where: {
          bookId,
        },
      });

      if (borrowedBookCount >= book.qtd) {
        return response.status(400).json({
          message: 'Todos livros ja foram emprestados!',
        });
      }

      await prisma.borrowedBook.create({
        data: {
          bookId,
          userId,
        },
      });

      // Atualizar o status do livro para emprestado
      const updatedBook = await prisma.book.update({
        where: {
          id: bookId,
        },
        include: {
          BorrowedBook: {
            select: {
              id: true,
            },
          },
        },
        data: {
          status: 'emprestado',
        },
      });

      return response.json({
        message: 'Livro emprestado com sucesso!',
        book: updatedBook,
      });
    } catch (error) {
      console.error(error);
      return response.status(500).json({
        message: 'Erro ao emprestar o livro!',
      });
    }
  }
}
