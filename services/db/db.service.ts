import { round } from '@utils/number-format';

import { Task, TaskGoalStatisticsRecord, TaskStatistics } from '../../domain';
import { prisma } from './prisma-client';
import {
  RawTaskGoalStatisticsRecord,
  taskStatisticsQuery,
  thisWeekActivitiesOfTaskQuery,
  trackableTasksWithGoalsQuery,
} from './queries';

const customTaskQueries = {
  taskStatistics: async (): Promise<TaskStatistics> => {
    const data = await taskStatisticsQuery();
    return data.map(item => ({
      ...item,
      time: Number(item.time),
      percent: round((Number(item.time) / Number(item.goal)) * 100),
    }));
  },
  taskGoalStatistics: async (): Promise<TaskGoalStatisticsRecord[]> => {
    const data = await trackableTasksWithGoalsQuery();
    return data.map((x: RawTaskGoalStatisticsRecord): TaskGoalStatisticsRecord => {
      const { id, goal, time, title, total_time } = x;
      return { id, title, time: Number(time), goal: Number(goal), totalMins: Number(total_time) };
    });
  },
};

const customActivitiesQueries = {
  byTaskAndThisWeek: async (id: Task['id']) => await thisWeekActivitiesOfTaskQuery(id),
};

export const dbService = {
  task: {
    ...prisma.task,
    ...customTaskQueries,
  },
  activity: {
    ...prisma.activity,
    ...customActivitiesQueries,
  },
  stopwatch: {
    ...prisma.stopwatch,
  },
};
