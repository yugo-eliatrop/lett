import { ArrowRightOutlined } from '@ant-design/icons';
import * as RD from '@devexperts/remote-data-ts';
import { createStopwatch } from '@features/Stopwatch';
import { ActivityStatisticsView } from '@ui/ActivityStatistics';
import { Blackout } from '@ui/Blackout';
import { GoalStatistics } from '@ui/GoalStatistics';
import { Button, Card, Input, message, Modal } from 'antd';
import { pipe } from 'fp-ts/lib/function';
import * as O from 'fp-ts/Option';
import { FC, useEffect, useMemo, useState } from 'react';

import { ActivitiesStatistics, Activity, Task, TaskMinsStatistics } from '../../domain';
import s from './TaskPlayer.module.css';

export type TaskPlayerProps = {
  task: Task;
  weekStatistics: RD.RemoteData<Error, ActivitiesStatistics>;
  createActivity: (time: number) => void;
  lastActivityStatus: RD.RemoteData<Error, Activity>;
  minsStatistics: RD.RemoteData<Error, TaskMinsStatistics>;
};

export const TaskPlayerView: FC<TaskPlayerProps> = ({
  task,
  createActivity,
  lastActivityStatus,
  weekStatistics,
  minsStatistics,
}) => {
  const [time, setTime] = useState<O.Option<number>>(O.none);
  const [modal, modalContextHolder] = Modal.useModal();
  const [messageApi, messageContextHolder] = message.useMessage();
  const Stopwatch = useMemo(() => createStopwatch(task, mins => pipe(mins, O.of, setTime)), [task, setTime]);

  const onSubmit = () => {
    pipe(
      time,
      O.map(mins => createActivity(mins))
    );
  };

  useEffect(() => {
    pipe(
      lastActivityStatus,
      RD.fold(
        () => null,
        () => null,
        e => {
          modal.error({
            title: 'Error',
            content: e.message,
          });
        },
        d => {
          messageApi.open({
            type: 'success',
            duration: 1,
            content: `${d.time} mins were added to ${task.title} task`,
          });
          setTime(O.none);
        }
      )
    );
  }, [lastActivityStatus, task, setTime]);

  return (
    <>
      <Stopwatch theme={s} disabled={RD.isPending(lastActivityStatus)} />
      <Card className={s.card} size="small" title="Add time">
        <Blackout isActive={RD.isPending(lastActivityStatus)}>
          <div className={s.timeBox}>
            <Input
              type="number"
              placeholder="Mins"
              onChange={e => setTime(O.fromNullable(+e.target.value))}
              value={pipe(
                time,
                O.map(x => `${x}`),
                O.getOrElse(() => '')
              )}
            />
            <Button disabled={O.isNone(time) || !time.value} onClick={onSubmit}>
              <ArrowRightOutlined />
            </Button>
          </div>
        </Blackout>
      </Card>
      <Card className={s.card} size="small" title="Statistics">
        <ActivityStatisticsView data={weekStatistics} goalTime={task.time} />
      </Card>
      {task.goal && (
        <Card className={s.card} size="small" title="Goal statistics">
          <GoalStatistics task={task as Task & { goal: number }} minsStatistics={minsStatistics} />
        </Card>
      )}
      {modalContextHolder}
      {messageContextHolder}
    </>
  );
};
