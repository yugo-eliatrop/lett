import { FC, useMemo } from "react";
import { Table } from "antd";

import { TaskStatisticsItem } from "@domain/task";

type SortOrder = 'descend' | 'ascend' | null;

const columns = [
  {
    title: 'Title',
    dataIndex: 'title',
    key: 'title',
  },
  {
    title: 'Mins',
    dataIndex: 'time',
    key: 'time',
    defaultSortOrder: 'descend' as SortOrder,
    sorter: {
      compare: (a: TaskStatisticsItem, b: TaskStatisticsItem) => a.time - b.time
    }
  },
  {
    title: 'Done %',
    dataIndex: 'percent',
    key: 'percent',
    sorter: {
      compare: (a: TaskStatisticsItem, b: TaskStatisticsItem) => a.percent - b.percent
    }
  },
];

export type TaskStatisticsProps = {
  data: TaskStatisticsItem[];
}

export const TaskStatistics: FC<TaskStatisticsProps> = ({ data }) => {
  const tableData = useMemo(() => data.map(item => ({ key: item.id, ...item })), [data]);

  return <Table columns={columns} dataSource={tableData} pagination={false} />
};
