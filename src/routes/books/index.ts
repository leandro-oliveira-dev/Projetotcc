import { Router } from 'express';

import { BookController } from '@/controllers/BookController';
import { authMiddleware } from '@/middlewares/authMiddleware';

const booksRouter = Router();

booksRouter.use(authMiddleware);
booksRouter.post('/books/create', BookController.CreateBook);
booksRouter.get('/books/list', BookController.ListBook);
booksRouter.put('/books/update', BookController.UpdateBook);
booksRouter.delete('/books/delete/:code', BookController.DeleteBook);

export { booksRouter };
