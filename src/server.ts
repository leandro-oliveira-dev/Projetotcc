import cors from 'cors';
import Express from 'express';

import { userRouter } from '@/routes/users';

import { booksRouter } from './routes/books';

const app = Express();

app.use(cors());

app.use(Express.json());

app.use(userRouter);
app.use(booksRouter);

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server is running ${PORT}`);
});
