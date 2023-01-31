import { FC, useMemo } from "react";
import { Table } from "antd";

import { TaskStatisticsItem } from "@domain/task";

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
  },
  {
    title: 'Done %',
    dataIndex: 'percent',
    key: 'percent',
  },
];

export type TaskStatisticsProps = {
  data: TaskStatisticsItem[];
}

export const TaskStatistics: FC<TaskStatisticsProps> = ({ data }) => {
  const tableData = useMemo(() => data.map(item => ({ key: item.id, ...item })), [data]);

  return <Table columns={columns} dataSource={tableData} pagination={false} />
};
