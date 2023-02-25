import { ActivitiesStatistics, RawTaskStatisticsItem, Task, TaskGoalStatisticsRecord } from '../../domain';
import { prisma } from './prisma-client';

export const thisWeekActivitiesOfTaskQuery = (id: Task['id']): Promise<ActivitiesStatistics> => prisma.$queryRaw`
SELECT min(a.id) as id, sum(a.time) as time, date_trunc('day', a.created_at) as day
FROM activities AS a
WHERE
  task_id = ${id}
  AND extract(week from a.created_at) = extract(week from current_date)
  AND extract(year from a.created_at) = extract(year from current_date)
GROUP BY day
ORDER BY day ASC;`;

export const taskStatisticsQuery = (): Promise<RawTaskStatisticsItem[]> => prisma.$queryRaw`
SELECT t.id, t.title, sum(a.time) as time, t.time as goal
FROM tasks as t
JOIN activities AS a ON a.task_id = t.id
WHERE
  t.trackable = true
  AND t.active = true
  AND extract(week from a.created_at) = extract(week from current_date)
  AND extract(year from a.created_at) = extract(year from current_date)
GROUP BY t.id
ORDER BY time DESC;`;

export type RawTaskGoalStatisticsRecord = Pick<TaskGoalStatisticsRecord, 'id' | 'title'> & {
  time: bigint;
  goal: bigint;
  total_time: bigint;
};

export const trackableTasksWithGoalsQuery = (): Promise<RawTaskGoalStatisticsRecord[]> => prisma.$queryRaw`
SELECT t.id, t.title, t.time, t.goal, sum(a.time) as total_time
FROM tasks as t
JOIN activities AS a ON a.task_id = t.id
WHERE
  t.trackable = true
  AND t.goal IS NOT NULL
GROUP BY t.id
ORDER BY t.title ASC;`;
