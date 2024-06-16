import { PasswordService } from '../src/services/PasswordService';
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
  const generatedPassword = await PasswordService.Create(password);

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
  await CreateUser({
    name: 'Pedro Tavares',
    email: 'pedro.tavares18@etec.sp.gov.br',
    ra: '1111',
    password: '1234',
    isAdmin: true,
  });

  await CreateUser({
    name: 'Edmilson',
    email: 'edmilson@gmail.com',
    ra: '1111',
    password: '1234',
    isAdmin: true,
  });

  await CreateUser({
    name: 'Ieda',
    email: 'Ieda@gmail.com',
    ra: '1111',
    password: '1234',
    isAdmin: true,
  });

  await CreateUser({
    name: 'Tiago',
    email: 'tiago@gmail.com',
    ra: '1111',
    password: '1234',
    isAdmin: true,
  });

  await CreateUser({
    name: 'Leandro',
    email: 'lleandro.silva@outlook.com',
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
