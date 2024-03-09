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

      const books = await prisma.book.findMany({
        include: {
          BorrowedBook: {
            select: {
              id: true,
            },
          },
        },
        orderBy: {
          created_at: 'desc',
        },
        skip,
        take,
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
    const { name, author, position, status } = request.body;
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

    const book = await prisma.book.update({
      where: {
        id,
      },

      data: {
        name,
        author,
        position,
        status,
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

  static async BorrowBook(request: Request, response: Response) {
    try {
      const { userId } = request.body;
      const { id } = request.params;

      // Verificar se o livro existe
      const book = await prisma.book.findFirst({
        where: {
          id,
        },
      });

      if (!book) {
        return response.status(404).json({
          message: 'Livro não encontrado!',
        });
      }

      // Verificar se o livro está disponível para empréstimo
      if (book.status !== 'disponivel') {
        return response.status(400).json({
          message: 'Livro não disponível para empréstimo!',
        });
      }

      const borrowedBookCount = await prisma.borrowedBook.count({
        where: {
          bookId: id,
        },
      });

      if (borrowedBookCount >= book.qtd) {
        return response.status(400).json({
          message: 'Todos livros ja foram emprestados!',
        });
      }

      const created = await prisma.borrowedBook.create({
        data: {
          bookId: id,
          userId,
        },
      });

      console.log({ created });

      // Atualizar o status do livro para emprestado
      const updatedBook = await prisma.book.update({
        where: {
          id,
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
