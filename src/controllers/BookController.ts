import { Request, Response } from 'express';

import { prisma } from '@/database';
import { IBook } from '@/interfaces/IBook';

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

  static async ListBook(request: Request, response: Response) {
    const books = await prisma.book.findMany({
      orderBy: {
        created_at: 'desc',
      },
    });

    return response.json(books);
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
}
