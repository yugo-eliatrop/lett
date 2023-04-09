import type { Task } from '@prisma/client';
import { round } from '@utils/number-format';
import { toDDMMYY } from '@utils/time-format';
import { pipe } from 'fp-ts/lib/function';

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

export type TaskMinsStatistics = {
  total: number;
  lastTwoWeeks: number;
};

export const calculateGoalStat = (goal: number, timePerWeek: number, totalMins: number) => {
  const done = pipe(round((totalMins / 60 / goal) * 100, 2), p => (p > 100 ? 100 : p));
  const minsLeft = pipe(goal * 60 - totalMins, mins => (mins < 0 ? 0 : mins));
  const daysLeft = Math.ceil(minsLeft / (timePerWeek / 7));
  const now = new Date();
  const lastDay =
    daysLeft && daysLeft !== Number.POSITIVE_INFINITY
      ? toDDMMYY(new Date(now.getFullYear(), now.getMonth(), now.getDate() + daysLeft))
      : null;
  return { done, daysLeft, lastDay };
};
