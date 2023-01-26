import { round } from '@utils/number-format';
import { DashboardData, Task } from '../../domain';
import { prisma } from './prisma-client';
import { thisWeekActivitiesOfTaskQuery, dashboardTableQuery } from './queries';

const customTaskQueries = {
  dashboardTableQuery: async (): Promise<DashboardData> => {
    const data = await dashboardTableQuery();
    return data.map((item) => ({ ...item, time: Number(item.time), percent: round(Number(item.time) / Number(item.goal) * 100) }));
  }
}

const customActivitiesQueries = {
  byTaskAndThisWeek: async (id: Task['id']) => await thisWeekActivitiesOfTaskQuery(id),
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
