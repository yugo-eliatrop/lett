import { TaskStatisticsItem } from '@domain/task';
import { routes } from '@routes';
import { TaskTitle } from '@ui/TaskTitle';
import { toMMSS } from '@utils/time-format';
import { Table, Typography } from 'antd';
import Link from 'next/link';
import { FC, useMemo } from 'react';

type SortOrder = 'descend' | 'ascend' | null;

export type TaskStatisticsProps = {
  data: TaskStatisticsItem[];
  runningTaskIds: Set<number>;
};

export const TaskStatistics: FC<TaskStatisticsProps> = ({ data, runningTaskIds }) => {
  const tableData = useMemo(() => data.map(item => ({ key: item.id, ...item })), [data]);

  const columns = useMemo(
    () => [
      {
        title: 'Title',
        dataIndex: 'title',
        key: 'title',
        render: (title: string, item: TaskStatisticsItem) => (
          <Link href={routes.task(item.id)}>
            <TaskTitle isRunning={runningTaskIds.has(item.id)}>{title}</TaskTitle>
          </Link>
        ),
      },
      {
        title: 'Time',
        dataIndex: 'time',
        key: 'time',
        defaultSortOrder: 'descend' as SortOrder,
        sorter: {
          compare: (a: TaskStatisticsItem, b: TaskStatisticsItem) => a.time - b.time,
        },
        render: (mins: number) => toMMSS(mins),
      },
      {
        title: 'Done %',
        dataIndex: 'percent',
        key: 'percent',
        sorter: {
          compare: (a: TaskStatisticsItem, b: TaskStatisticsItem) => a.percent - b.percent,
        },
      },
    ],
    [runningTaskIds]
  );

  const totalTime = useMemo(() => toMMSS(data.reduce((sum, item) => sum + item.time, 0)), [data]);

  return (
    <>
      <Table columns={columns} dataSource={tableData} pagination={false} />
      <Typography.Text type="secondary">Total time: {totalTime}</Typography.Text>
    </>
  );
};
