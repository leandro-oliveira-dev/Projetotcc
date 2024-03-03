import { PasswordController } from '../src/controllers/PasswordController';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

type ICreateUser = {
  email: string;
  ra: string;
  name: string;
  password: string;
  isAdmin?: boolean;
};

async function CreateUser({ email, ra, name, password, isAdmin }: ICreateUser) {
  const generatedPassword = await PasswordController.Create(password);

  if (!generatedPassword) return;

  const userAuthExist = await prisma.auth.findUnique({
    where: { email, ra },
  });

  if (!userAuthExist) {
    return prisma.user.create({
      data: {
        name,
        isAdmin,
        auth: {
          create: {
            email,
            password: generatedPassword,
            ra,
          },
        },
      },
    });
  }
}

async function main() {
  const student = await CreateUser({
    name: 'aluno',
    email: 'aluno@email.com',
    ra: '2222',
    password: '1234',
  });

  const admin = await CreateUser({
    name: 'admin',
    email: 'admin@email.com',
    ra: '1111',
    password: '1234',
    isAdmin: true,
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
