import { Router } from 'express';

import { BookController } from '@/controllers/BookController';
import { authMiddleware } from '@/middlewares/authMiddleware';
import { BorrowBookController } from '@/controllers/BorrowBookController';
import { ReportController } from '@/controllers/ReportController';

const booksRouter = Router();

booksRouter.use(authMiddleware);
booksRouter.post('/books/create', BookController.CreateBook);
booksRouter.get('/books/list', BookController.ListBook);
booksRouter.get('/books/code/:codeId', BookController.ListOneBookByCode);
booksRouter.put('/books/update/:id', BookController.UpdateBook);
booksRouter.delete('/books/delete/:id', BookController.DeleteBook);
booksRouter.put('/books/borrow/:bookId', BorrowBookController.CreateBorrowBook);

booksRouter.get(
  '/books/:bookId/borrowed-report',
  ReportController.ListBookDetail
);

booksRouter.get('/books/borrowed-report', ReportController.ListAllBooksDetail);

booksRouter.get(
  '/books/borrowed-report/csv-download',
  ReportController.ListBooksReportCsv
);

booksRouter.put(
  '/books/borrow/:borrowedBookId/return',
  BorrowBookController.ReturnBorrowedBook
);

// Importe o método do controller que lidará com a busca de todos os livros
booksRouter.get('/books/all', BookController.ListAllBooks);
export { booksRouter };
