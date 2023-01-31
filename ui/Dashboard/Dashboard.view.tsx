import { TaskStatistics, TaskStatisticsProps } from "./TaskStatistics";
import { GoalStatistics, GoalStatisticsProps } from "./GoalStatistics";
import { FC } from "react";

import s from './Dashboard.module.css';

export type DashboardProps = {
  taskStatistics: TaskStatisticsProps['data'];
  goalStatistics: GoalStatisticsProps['data'];
};

export const Dashboard: FC<DashboardProps> = ({ taskStatistics, goalStatistics }) => {

  return (
    <>
      <div className={s.dashboardItem}>
        <TaskStatistics data={taskStatistics} />
      </div>
      <div className={s.dashboardItem}>
        <GoalStatistics data={goalStatistics} />
      </div>
    </>
  );
};
