import { Router } from 'express';

import { BookController } from '@/controllers/BookController';
import { authMiddleware } from '@/middlewares/authMiddleware';
import { BorrowBookController } from '@/controllers/BorrowBookController';
import { ReportController } from '@/controllers/ReportController';

const booksRouter = Router();

booksRouter.use(authMiddleware);
booksRouter.post('/books/create', BookController.CreateBook);
booksRouter.get('/books/list', BookController.ListBook);
booksRouter.put('/books/update/:id', BookController.UpdateBook);
booksRouter.delete('/books/delete/:code', BookController.DeleteBook);
booksRouter.put('/books/borrow/:bookId', BorrowBookController.CreateBorrowBook);

booksRouter.get(
  '/books/:bookId/borrowed-report',
  ReportController.ListBookDetail
);

booksRouter.post('/books/borrow/return', ReportController.ReturnBorrowedBook);

export { booksRouter };
