import { prisma } from '@/database';
import { Request, Response } from 'express';

export class ReportController {
  public static async ListBookDetail(request: Request, response: Response) {
    const { bookId } = request.params;

    const book = await prisma.book.findFirst({
      where: {
        id: bookId,
      },
    });

    const borrowedBooks = await prisma.borrowedBook.findMany({
      where: {
        bookId,
      },
      include: {
        user: {
          include: {
            auth: {
              select: {
                ra: true,
              },
            },
          },
        },
      },
    });

    if (!borrowedBooks)
      return response.status(404).json({
        message: 'borrowed books not found',
      });

    return response.json({ borrowedBooks, book });
  }

  public static async ListAllBooksDetail(request: Request, response: Response) {
    const borrowedBooks = await prisma.borrowedBook.findMany({
      include: {
        user: {
          include: {
            auth: {
              select: {
                ra: true,
              },
            },
          },
        },
        book: true,
      },
    });

    if (!borrowedBooks)
      return response.status(404).json({
        message: 'borrowed books not found',
      });

    return response.json({ borrowedBooks });
  }

  public static async ReportUserController(
    request: Request,
    response: Response
  ) {
    const users = await prisma.user.findMany({
      include: { auth: { select: { ra: true } } },
    });

    if (!users.length) {
      return response.status(404).json({
        message: 'User not found',
      });
    }

    return response.json(users);
  }
}
