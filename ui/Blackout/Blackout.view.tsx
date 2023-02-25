import { Spin } from 'antd';
import cn from 'classnames';
import { FC, PropsWithChildren } from 'react';

import s from './Blackout.module.css';

type BlackoutProps = PropsWithChildren<{
  isActive: boolean;
}>;

export const Blackout: FC<BlackoutProps> = ({ isActive, children }) => (
  <div className={s.wrapper}>
    <div className={cn(isActive && s.blurred)}>{children}</div>
    {isActive && (
      <div className={s.blackout}>
        <Spin size="large" />
      </div>
    )}
  </div>
);
