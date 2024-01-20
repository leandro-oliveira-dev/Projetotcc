import { Router } from 'express';

import { BookController } from '@/controllers/BookController';

const booksRouter = Router();

booksRouter.post('/books/create', BookController.CreateBook);
booksRouter.get('/books/list/:code', BookController.ListBook);
booksRouter.put('/books/update', BookController.UpdateBook);
booksRouter.delete('/books/delete/:code', BookController.DeleteBook);

export { booksRouter };
