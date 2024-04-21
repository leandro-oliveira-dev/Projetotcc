import { Request, Response } from 'express';

import { prisma } from '@/database';
import { IBook } from '@/interfaces/IBook';
import { AuthenticatedRequest } from '@/middlewares/authMiddleware';
import { BookStatus } from '@prisma/client';

interface IFindBooks {
  where?: {
    status?: BookStatus;
    name?: {
      contains: string;
    };
  };
  userId?: string;
  skip: number;
  take: number;
}

async function findAllBooks({ userId, skip, take, where }: IFindBooks) {
  const selectedBooks = await prisma.book.findMany({
    where,
    include: {
      Shelf: {
        select: {
          gender: true,
          position: true,
        },
      },
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
          borrowedBook.userId === userId && borrowedBook.returnAt === null
      ).length > 0;

    return { ...book, alreadyBorrowed };
  });

  return books;
}

export class BookController {
  static async CreateBook(request: Request, response: Response) {
    try {
      const { qtd, code, name, author, position, status, gender }: IBook =
        request.body;

      const book = await prisma.book.create({
        data: {
          name,
          qtd: Number(qtd),
          author,
          Shelf: {
            create: {
              position: Number(position),
              gender,
            },
          },
          status,
          code: Number(code),
        },
        include: {
          Shelf: {
            select: {
              gender: true,
              position: true,
            },
          },
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

  static async ListOneBookByCode(
    request: AuthenticatedRequest,
    response: Response
  ) {
    const { codeId } = request.params;

    const book = await prisma.book.findFirst({
      include: {
        Shelf: {
          select: {
            gender: true,
            position: true,
          },
        },
      },
      where: {
        code: Number(codeId),
      },
    });

    return response.json(book);
  }

  static async ListBook(request: AuthenticatedRequest, response: Response) {
    try {
      const { page = 1, pageSize = 10, status, name } = request.query;
      const pageNumber = parseInt(page as string, 10);
      const pageSizeNumber = parseInt(pageSize as string, 10);
      const skip = (pageNumber - 1) * pageSizeNumber;
      const take = pageSizeNumber;
      const totalBooks = await prisma.book.count();
      const totalPages = Math.ceil(totalBooks / pageSizeNumber);

      const hasPreviousPage = pageNumber > 1;
      const hasNextPage = pageNumber < totalPages;
      const userId = request.authenticated?.userId;

      const books = await findAllBooks({
        userId,
        skip,
        take,
        where: {
          status: status as BookStatus,
          ...(name && { name: { contains: String(name) } }),
        },
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
        error,
      });
    }
  }

  static async UpdateBook(request: Request, response: Response) {
    const { name, author, status, code, qtd, position, gender } = request.body;
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
        status,
      },
    });

    await prisma.shelf.upsert({
      where: {
        bookId: id,
      },
      update: {
        position,
        gender,
      },
      create: {
        bookId: id,
        position,
        gender,
      },
    });

    const book = await prisma.book.findFirst({
      where: {
        id,
      },
      include: {
        Shelf: {
          select: {
            gender: true,
            position: true,
          },
        },
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

  static async ListAllBooks(request: AuthenticatedRequest, response: Response) {
    try {
      const { page = 1, pageSize = 10, name } = request.query;
      const pageNumber = parseInt(page as string, 10);
      const pageSizeNumber = parseInt(pageSize as string, 10);
      const skip = (pageNumber - 1) * pageSizeNumber;
      const take = pageSizeNumber;
      const totalBooks = await prisma.book.count();
      const totalPages = Math.ceil(totalBooks / pageSizeNumber);

      const hasPreviousPage = pageNumber > 1;
      const hasNextPage = pageNumber < totalPages;
      const userId = request.authenticated?.userId;
      // Busque todos os livros no banco de dados
      const books = await findAllBooks({
        userId,
        skip,
        take,
        where: {
          name: {
            contains: String(name),
          },
        },
      });

      // Retorne os livros como resposta
      return response.json({
        books,
        totalBooks,
        totalPages,
        hasPreviousPage,
        hasNextPage,
      });
    } catch (error) {
      console.log(error);
      return response.status(500).json({ message: 'Internal server error' });
    }
  }
}
