import { prisma } from '@/database';
import { Request, Response } from 'express';

export class ReportController {
  public static async ListBookDetail(request: Request, response: Response) {
    const { bookId } = request.params;

    const { page = 1, pageSize = 10 } = request.query;

    const pageNumber = parseInt(page as string, 10);
    const pageSizeNumber = parseInt(pageSize as string, 10);
    const skip = (pageNumber - 1) * pageSizeNumber;
    const take = pageSizeNumber;
    const totalBooks = await prisma.borrowedBook.count({
      where: {
        id: bookId,
      },
    });
    const totalPages = Math.ceil(totalBooks / pageSizeNumber);

    const hasPreviousPage = pageNumber > 1;
    const hasNextPage = pageNumber < totalPages;

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
      skip,
      take,
    });

    if (!borrowedBooks)
      return response.status(404).json({
        message: 'borrowed books not found',
      });

    return response.json({
      borrowedBooks,
      book,
      hasPreviousPage,
      hasNextPage,
      totalBooks,
      totalPages,
    });
  }

  public static async ListAllBooksDetail(request: Request, response: Response) {
    const { page = 1, pageSize = 10 } = request.query;

    const pageNumber = parseInt(page as string, 10);
    const pageSizeNumber = parseInt(pageSize as string, 10);
    const skip = (pageNumber - 1) * pageSizeNumber;
    const take = pageSizeNumber;
    const totalBooks = await prisma.borrowedBook.count();
    const totalPages = Math.ceil(totalBooks / pageSizeNumber);

    const hasPreviousPage = pageNumber > 1;
    const hasNextPage = pageNumber < totalPages;

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
      skip,
      take,
    });

    if (!borrowedBooks)
      return response.status(404).json({
        message: 'borrowed books not found',
      });

    return response.json({
      borrowedBooks,
      totalBooks,
      totalPages,
      hasPreviousPage,
      hasNextPage,
    });
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
