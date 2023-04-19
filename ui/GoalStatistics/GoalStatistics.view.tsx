import * as RD from '@devexperts/remote-data-ts';
import { calculateGoalStat, Task, TaskMinsStatistics } from '@domain/task';
import { Blackout } from '@ui/Blackout';
import { toMMSS } from '@utils/time-format';
import { Typography } from 'antd';
import React, { FC, useEffect, useMemo, useState } from 'react';

import s from './GoalStatistics.module.css';

type GoalStatisticsProps = {
  minsStatistics: RD.RemoteData<Error, TaskMinsStatistics>;
  task: Task & { goal: number };
};

export const GoalStatistics: FC<GoalStatisticsProps> = ({ minsStatistics, task }) => {
  const [lastMinsStatistics, setLastMinsStatistics] = useState<TaskMinsStatistics>({ total: 0, lastTwoWeeks: 0 });

  useEffect(() => {
    if (RD.isSuccess(minsStatistics)) {
      setLastMinsStatistics(minsStatistics.value);
    }
  }, [minsStatistics, setLastMinsStatistics]);

  const { daysLeft, done, lastDay } = useMemo(
    () => calculateGoalStat(task.goal, task.time, lastMinsStatistics.total),
    [task, lastMinsStatistics]
  );

  const prediction = useMemo(
    () => calculateGoalStat(task.goal, lastMinsStatistics.lastTwoWeeks / 2, lastMinsStatistics.total),
    [task, lastMinsStatistics]
  );

  return (
    <Blackout isActive={RD.isPending(minsStatistics)}>
      <div className={s.line}>
        <Typography.Text>Total hours</Typography.Text>
        <Typography.Text>{toMMSS(lastMinsStatistics.total)}</Typography.Text>
      </div>
      <div className={s.line}>
        <Typography.Text>Done</Typography.Text>
        <Typography.Text>{done}%</Typography.Text>
      </div>
      <div className={s.line}>
        <Typography.Text>Days left</Typography.Text>
        <Typography.Text>
          {daysLeft} / {prediction.daysLeft}
        </Typography.Text>
      </div>
      <div className={s.line}>
        <Typography.Text>Last day</Typography.Text>
        <Typography.Text>
          {lastDay || '-'} / {prediction.lastDay || '-'}
        </Typography.Text>
      </div>
    </Blackout>
  );
};
