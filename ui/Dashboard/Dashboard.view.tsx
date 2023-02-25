import { FC } from 'react';

import { DashboardItem } from './DashboardItem.view';
import { GoalStatistics, GoalStatisticsProps } from './GoalStatistics';
import { TaskStatistics, TaskStatisticsProps } from './TaskStatistics';

export type DashboardProps = {
  taskStatistics: TaskStatisticsProps['data'];
  goalStatistics: GoalStatisticsProps['data'];
  runningTaskIds: Set<number>;
};

export const Dashboard: FC<DashboardProps> = ({ taskStatistics, goalStatistics, runningTaskIds }) => {
  return (
    <>
      <DashboardItem title="Week statistics">
        <TaskStatistics data={taskStatistics} runningTaskIds={runningTaskIds} />
      </DashboardItem>
      <DashboardItem title="Goal statistics">
        <GoalStatistics data={goalStatistics} />
      </DashboardItem>
    </>
  );
};
