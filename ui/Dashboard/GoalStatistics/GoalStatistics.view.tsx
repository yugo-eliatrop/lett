import { calculateGoalStat, TaskGoalStatisticsRecord } from '@domain/task';
import { Table } from 'antd';
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
  return { key: id, title, ...calculateGoalStat(goal, time, totalMins) };
};

export type GoalStatisticsProps = {
  data: TaskGoalStatisticsRecord[];
};

export const GoalStatistics: FC<GoalStatisticsProps> = ({ data }) => {
  const tableData = useMemo(() => data.map(mapGoalRecordToTableRow), [data]);

  if (tableData.length) return <Table columns={columns} dataSource={tableData} pagination={false} />;

  return null;
};
