import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({ errorFormat: 'minimal' });

export const dbService = {
  task: {
    ...prisma.task,
  },
  activity: {
    ...prisma.activity,
  },
};
