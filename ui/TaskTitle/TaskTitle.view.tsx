import { FieldTimeOutlined } from '@ant-design/icons';
import { FC, PropsWithChildren } from 'react';

import s from './TaskTitle.module.css';

type TaskTitleProps = PropsWithChildren & {
  isRunning?: boolean;
};

export const TaskTitle: FC<TaskTitleProps> = ({ isRunning, children }) => (
  <>
    {isRunning && <FieldTimeOutlined className={s.timerIcon} />}
    {children}
  </>
);
