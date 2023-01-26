import { NotRequiredId } from './types';

import type { Task } from '@prisma/client';

export type { Task } from '@prisma/client';

export type EditedTask = NotRequiredId<Task>;

export type DashboardDataItemRaw = Pick<Task, 'id' | 'title' | 'time'> & {
  goal: number;
};

export type DashboardDataItem = Pick<Task, 'id' | 'title' | 'time'> & {
  percent: number;
};

export type DashboardData = DashboardDataItem[];
