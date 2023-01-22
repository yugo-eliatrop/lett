export type { Activity } from '@prisma/client';

export type ActivitiesStatisticsItem = {
  id: number;
  time: number;
  day: Date;
};

export type ActivitiesStatistics = ActivitiesStatisticsItem[];
