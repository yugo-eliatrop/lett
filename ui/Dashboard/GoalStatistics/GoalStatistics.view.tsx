import { TaskGoalStatisticsRecord } from '@domain/task';
import { round } from '@utils/number-format';
import { toDDMMYY } from '@utils/time-format';
import { Table } from 'antd';
import { pipe } from 'fp-ts/lib/function';
import { FC, useMemo } from 'react';

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
  const done = pipe(round((totalMins / 60 / goal) * 100, 2), p => (p > 100 ? 100 : p));
  const minsLeft = pipe(goal * 60 - totalMins, mins => (mins < 0 ? 0 : mins));
  const daysLeft = Math.ceil(minsLeft / (time / 7));
  const now = new Date();
  const lastDay = daysLeft ? toDDMMYY(new Date(now.getFullYear(), now.getMonth(), now.getDate() + daysLeft)) : null;
  return { key: id, title, done, daysLeft, lastDay };
};

export type GoalStatisticsProps = {
  data: TaskGoalStatisticsRecord[];
};

export const GoalStatistics: FC<GoalStatisticsProps> = ({ data }) => {
  const tableData = useMemo(() => data.map(mapGoalRecordToTableRow), [data]);

  if (tableData.length) return <Table columns={columns} dataSource={tableData} pagination={false} />;

  return null;
};
