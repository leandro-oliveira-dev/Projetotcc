import dotenv from 'dotenv';
dotenv.config();

import cors from 'cors';
import Express from 'express';

import { userRouter } from '@/routes/users';
import { booksRouter } from '@/routes/books';
import { authRouter } from '@/routes/public/auth';

const app = Express();

app.use(cors());

app.use(Express.json());

app.use(authRouter);

app.use(booksRouter);
app.use(userRouter);

let doacoes: any[];

// Rota para receber os dados do frontend
app.post('/doarLivro', (req, res) => {
  const { usuario, dataEntrega } = req.body;
  doacoes.push({ usuario, dataEntrega });
  res.json(doacoes);
});

// Rota para acessar os dados da tabela
app.get('/doarLivro', (req, res) => {
  res.json(doacoes);
});

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server is running ${PORT}`);
});
