import { Typography } from 'antd';
import { FC, PropsWithChildren } from 'react';

import s from './Dashboard.module.css';

type DashboardItemProps = PropsWithChildren & {
  title: string;
};

export const DashboardItem: FC<DashboardItemProps> = ({ children, title }) => (
  <div className={s.dashboardItem}>
    <Typography.Title level={4}>{title}</Typography.Title>
    {children}
  </div>
);
