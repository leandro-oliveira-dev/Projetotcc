import { Request, Response } from 'express';

import { prisma } from '@/database';
import { IBook } from '@/interfaces/IBook';
import { AuthenticatedRequest } from '@/middlewares/authMiddleware';

export class BookController {
  static async CreateBook(request: Request, response: Response) {
    try {
      const { qtd, code, name, author, position, status }: IBook = request.body;

      const book = await prisma.book.create({
        data: {
          name,
          qtd: Number(qtd),
          author,
          position,
          status,
          code: Number(code),
        },
      });

      return response.json({
        message: 'Livro cadastrado com sucesso!',
        book,
      });
    } catch (error) {
      return response.status(500).json({
        message: 'Falha ao cadastrar o livro',
      });
    }
  }

  static async ListBook(request: AuthenticatedRequest, response: Response) {
    try {
      const { page = 1, pageSize = 10 } = request.query;
      const pageNumber = parseInt(page as string, 10);
      const pageSizeNumber = parseInt(pageSize as string, 10);

      const skip = (pageNumber - 1) * pageSizeNumber;
      const take = pageSizeNumber;
      const totalBooks = await prisma.book.count();
      const totalPages = Math.ceil(totalBooks / pageSizeNumber);

      const hasPreviousPage = pageNumber > 1;
      const hasNextPage = pageNumber < totalPages;

      const selectedBooks = await prisma.book.findMany({
        include: {
          BorrowedBook: {
            select: {
              id: true,
              userId: true,
              returnAt: true,
            },
            where: {
              returnAt: null,
            },
          },
        },
        orderBy: {
          created_at: 'desc',
        },
        skip,
        take,
      });

      const books = selectedBooks.map((book) => {
        const alreadyBorrowed =
          book.BorrowedBook.filter(
            (borrowedBook) =>
              borrowedBook.userId === request.authenticated?.userId &&
              borrowedBook.returnAt === null
          ).length > 0;

        return { ...book, alreadyBorrowed };
      });

      return response.json({
        books,
        totalBooks,
        totalPages,
        hasPreviousPage,
        hasNextPage,
      });
    } catch (error) {
      console.error(error);
      return response.status(500).json({
        message: 'Falha ao listar os livros',
      });
    }
  }

  static async UpdateBook(request: Request, response: Response) {
    const { name, author, position, status, code, qtd } = request.body;
    const { id } = request.params;

    const bookExists = await prisma.book.findFirst({
      where: {
        id,
      },
    });

    if (!bookExists) {
      return response.status(400).json({
        message: 'Error: Livro não encontrado!',
      });
    }

    await prisma.book.update({
      where: {
        id,
      },

      data: {
        name,
        code,
        author,
        qtd,
        position,
        status,
      },
    });

    const book = await prisma.book.findFirst({
      where: {
        id,
      },
      include: {
        BorrowedBook: {
          select: {
            id: true,
          },
        },
      },
    });

    return response.json({
      message: 'Sucesso: Livro atualizado com sucesso!',
      book,
    });
  }

  static async DeleteBook(request: Request, response: Response) {
    const { id } = request.params;

    const bookExists = await prisma.book.findFirst({
      where: {
        id,
      },
    });

    if (!bookExists) {
      return response.json({
        error: true,
        message: 'Error: Livro não encontrado!',
      });
    }

    const book = await prisma.book.delete({
      where: {
        id,
      },
    });

    return response.json({
      error: false,
      message: 'Sucesso: Livro deletado com sucesso!',
      book,
    });
  }
}
