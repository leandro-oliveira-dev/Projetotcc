import { Request, Response } from 'express';

import { prisma } from '@/database';

export class BorrowBookController {
  public static async CreateBorrowBook(request: Request, response: Response) {
    try {
      const { userId } = request.body;
      const { bookId } = request.params;

      // Verificar se o livro existe
      const bookAlreadyBorrowedByThisUser = await prisma.borrowedBook.findFirst(
        {
          where: {
            userId,
            bookId,
            returnAt: null,
          },
        }
      );

      if (bookAlreadyBorrowedByThisUser) {
        return response.status(404).json({
          message: 'Livro ja emprestado por esse usuario!',
        });
      }

      const book = await prisma.book.findFirst({
        where: {
          id: bookId,
        },
        include: {
          BorrowedBook: true,
        },
      });

      if (!book) {
        return response.status(404).json({
          message: 'Livro nao encontrado!',
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
          returnAt: null,
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

      const currentBorrowedBooks = book.BorrowedBook.filter(
        (borrowedBook) => !borrowedBook.returnAt
      ).length;

      const isBookFull = currentBorrowedBooks <= book.qtd;

      // Atualizar o status do livro para emprestado
      if (isBookFull) {
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
      }

      return response.json({
        message: 'Livro emprestado com sucesso!',
        book,
      });
    } catch (error) {
      console.error(error);
      return response.status(500).json({
        message: 'Erro ao emprestar o livro!',
      });
    }
  }

  static async ReturnBorrowedBook(request: Request, response: Response) {
    const { borrowedBookId } = request.params;

    await prisma.borrowedBook.update({
      where: {
        id: borrowedBookId,
      },
      data: {
        returnAt: new Date(),
      },
    });

    const book = await prisma.book.findFirst({
      include: {
        BorrowedBook: true,
      },
      where: {
        BorrowedBook: {
          some: {
            id: borrowedBookId,
          },
        },
      },
    });

    if (!book) {
      return response.status(404).json({
        message: 'Livro nao encontrado!',
      });
    }

    const currentBorrowedBooks = book.BorrowedBook.filter(
      (borrowedBook) => !borrowedBook.returnAt
    ).length;

    const isBookFull = currentBorrowedBooks >= book.qtd;

    await prisma.book.update({
      where: {
        id: book.id,
      },
      data: {
        status: isBookFull ? 'emprestado' : 'disponivel',
      },
    });

    return response.sendStatus(201);
  }
}
