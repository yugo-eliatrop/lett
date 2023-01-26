import { FC } from "react";
import { Table } from "antd";

import { DashboardData } from "@domain/task";

const columns = [
  {
    title: 'Title',
    dataIndex: 'title',
    key: 'title',
  },
  {
    title: 'Time',
    dataIndex: 'time',
    key: 'time',
  },
  {
    title: 'Percent',
    dataIndex: 'percent',
    key: 'percent',
  },
];

type TableViewProps = {
  data: DashboardData;
}

export const TableView: FC<TableViewProps> = ({ data }) => {

  return <Table columns={columns} dataSource={data} pagination={false} />
};
