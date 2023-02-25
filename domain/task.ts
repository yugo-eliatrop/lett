import type { Task } from '@prisma/client';

import { NotRequiredId } from './types';

export type { Task } from '@prisma/client';

export type EditedTask = NotRequiredId<Task>;

export type TaskGoalStatisticsRecord = Pick<Task, 'id' | 'title' | 'time'> & {
  totalMins: number;
  goal: number;
};

export type RawTaskStatisticsItem = Pick<Task, 'id' | 'title' | 'time'> & {
  goal: number;
};

export type TaskStatisticsItem = Pick<Task, 'id' | 'title' | 'time'> & {
  percent: number;
};

export type TaskStatistics = TaskStatisticsItem[];
