import { FC, useMemo } from "react";
import { Table } from "antd";

import { TaskGoalStatisticsRecord } from "@domain/task";
import { round } from "@utils/number-format";
import { pipe } from "fp-ts/lib/function";
import { toDDMMYY } from "@utils/time-format";

const columns = [
  {
    title: 'Title',
    dataIndex: 'title',
    key: 'title',
  },
  {
    title: 'Done %',
    dataIndex: 'done',
    key: 'done',
  },
  {
    title: 'Days left',
    dataIndex: 'daysLeft',
    key: 'daysLeft',
  },
  {
    title: 'Last day',
    dataIndex: 'lastDay',
    key: 'lastDay',
  },
];

const mapGoalRecordToTableRow = ({ id, title, goal, time, totalMins }: TaskGoalStatisticsRecord) => {
  const done = round(totalMins / 60 / goal, 2);
  const minsLeft = pipe(goal * 60 - totalMins, mins => mins < 0 ? 0 : mins);
  const daysLeft = Math.ceil(minsLeft / (time / 7));
  const now = new Date();
  const lastDay = toDDMMYY(new Date(now.getFullYear(), now.getMonth(), now.getDate() + daysLeft));
  return { id, title, done, daysLeft, lastDay };
};

export type GoalStatisticsProps = {
  data: TaskGoalStatisticsRecord[];
};

export const GoalStatistics: FC<GoalStatisticsProps> = ({ data }) => {
  const tableData = useMemo(() => data.map(mapGoalRecordToTableRow), [data]);

  if (tableData.length) return <Table columns={columns} dataSource={tableData} pagination={false} />;

  return null;
};
