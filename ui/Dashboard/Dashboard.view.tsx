import { TaskStatistics, TaskStatisticsProps } from "./TaskStatistics";
import { GoalStatistics, GoalStatisticsProps } from "./GoalStatistics";
import { FC } from "react";

import { DashboardItem } from "./DashboardItem.view";

export type DashboardProps = {
  taskStatistics: TaskStatisticsProps['data'];
  goalStatistics: GoalStatisticsProps['data'];
};

export const Dashboard: FC<DashboardProps> = ({ taskStatistics, goalStatistics }) => {

  return (
    <>
      <DashboardItem title="Week statistics">
        <TaskStatistics data={taskStatistics} />
      </DashboardItem>
      <DashboardItem title="Goal statistics">
        <GoalStatistics data={goalStatistics} />
      </DashboardItem>
    </>
  );
};
