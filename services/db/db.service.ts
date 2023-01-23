import { Task } from '../../domain';
import { prisma } from './prisma-client';
import { mostPopularTaskQuery, thisWeekActivitiesOfTask } from './queries';

const customTaskQueries = {
  mostPopular: async (): Promise<Task | undefined> => (await mostPopularTaskQuery())[0],
}

const customActivitiesQueries = {
  byTaskAndThisWeek: async (id: Task['id']) => await thisWeekActivitiesOfTask(id),
}

export const dbService = {
  task: {
    ...prisma.task,
    ...customTaskQueries
  },
  activity: {
    ...prisma.activity,
    ...customActivitiesQueries,
  },
};
