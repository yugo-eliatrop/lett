import { FC, PropsWithChildren } from 'react';

import s from './Dashboard.module.css';

type DashboardItemProps = PropsWithChildren & {
  title: string;
};

export const DashboardItem: FC<DashboardItemProps> = ({ children, title }) => (
  <div className={s.dashboardItem}>
    <h3>{title}</h3>
    {children}
  </div>
);
