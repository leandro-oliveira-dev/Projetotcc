import { prisma } from '@/database';

interface IHistoryParams {
  userId: string;
  description: string;
}

export class HistoryService {
  static async onCreate({ userId, description }: IHistoryParams) {
    await prisma.history.create({
      data: {
        userId,
        description,
        action: 'create',
      },
    });
  }
  static async onUpdate({ userId, description }: IHistoryParams) {
    await prisma.history.create({
      data: {
        userId,
        description,
        action: 'update',
      },
    });
  }
  static async onDelete({ userId, description }: IHistoryParams) {
    await prisma.history.create({
      data: {
        userId,
        description,
        action: 'delete',
      },
    });
  }
}
