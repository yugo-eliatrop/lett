import * as RD from '@devexperts/remote-data-ts';
import { calculateGoalStat, Task } from '@domain/task';
import { Blackout } from '@ui/Blackout';
import { toMMSS } from '@utils/time-format';
import { Typography } from 'antd';
import React, { FC, useEffect, useMemo, useState } from 'react';

import s from './GoalStatistics.module.css';

type GoalStatisticsProps = {
  totalTime: RD.RemoteData<Error, number>;
  task: Task & { goal: number };
};

export const GoalStatistics: FC<GoalStatisticsProps> = ({ totalTime, task }) => {
  const [lastTotalTime, setLastTotalTime] = useState<number>(0);

  useEffect(() => {
    if (RD.isSuccess(totalTime)) {
      setLastTotalTime(totalTime.value);
    }
  }, [totalTime, setLastTotalTime]);

  const { daysLeft, done, lastDay } = useMemo(
    () => calculateGoalStat(task.goal, task.time, lastTotalTime),
    [task, lastTotalTime]
  );

  return (
    <Blackout isActive={RD.isPending(totalTime)}>
      <div className={s.line}>
        <Typography.Text>Total hours</Typography.Text>
        <Typography.Text>{toMMSS(lastTotalTime)}</Typography.Text>
      </div>
      <div className={s.line}>
        <Typography.Text>Done</Typography.Text>
        <Typography.Text>{done}%</Typography.Text>
      </div>
      <div className={s.line}>
        <Typography.Text>Days left</Typography.Text>
        <Typography.Text>{daysLeft}</Typography.Text>
      </div>
      <div className={s.line}>
        <Typography.Text>Last day</Typography.Text>
        <Typography.Text>{lastDay || '-'}</Typography.Text>
      </div>
    </Blackout>
  );
};
