import { FC, useEffect, useState } from "react";

import { Activity, Task } from '../../domain';
import * as O from 'fp-ts/Option';
import * as RD from '@devexperts/remote-data-ts';
import { Card, Input, Button, Modal } from "antd";
import { pipe, flow } from "fp-ts/lib/function";

import s from './TaskPlayer.module.css';
import { CaretRightOutlined, ArrowRightOutlined, BorderOutlined } from "@ant-design/icons";
import { toMMSS } from "@utils/time-format";
import { interval, Subscription } from "rxjs";
import { Blackout } from "@ui/Blackout";

export type TaskPlayerProps = {
  task: Task;
  createActivity: (taskId: Task['id'], mins: number) => void;
  lastActivityStatus: RD.RemoteData<Error, Activity>;
}

export const TaskPlayer: FC<TaskPlayerProps> = ({ task, createActivity, lastActivityStatus }) => {
  const [stopwatch, setStopwatch] = useState<O.Option<number>>(O.none);
  const [time, setTime] = useState<O.Option<number>>(O.none);
  const [swSubscription, setSwSubscription] = useState<O.Option<Subscription>>(O.none);
  const [modal, contextHolder] = Modal.useModal();

  const onSubmit = () => {
    pipe(
      time,
      O.map(mins => createActivity(task.id, mins)),
    );
  };

  const startStopwatch = () => {
    const subscription = interval(100).subscribe(flow(O.of, setStopwatch));
    setSwSubscription(O.of(subscription));
  };

  const stopStopwatch = () => {
    setTime(pipe(stopwatch, O.map(s => Math.round(s / 60))));
    setStopwatch(O.none);
    pipe(swSubscription, O.map(s => s.unsubscribe()));
    setSwSubscription(O.none);
  };

  useEffect(() => {
    pipe(
      lastActivityStatus,
      RD.fold(
        () => null,
        () => null,
        (e) => {
          modal.error({
            title: 'Error',
            content: e.message,
          })
        },
        (d) => {
          modal.success({
            title: 'Success',
            content: `${d.time} mins were added to ${task.title} task`
          });
          setTime(O.none);
        }
      )
    );
  }, [lastActivityStatus, task, setTime]);

  return (
    <>
      <Card className={s.card} size="small" title="Stopwatch">
        <Blackout isActive={RD.isPending(lastActivityStatus)}>
          <div className={s.timeBox}>
            {
              pipe(
                stopwatch,
                O.map(toMMSS),
                O.fold(
                  () => (
                    <>
                      <span>{toMMSS(0)}</span>
                      <Button onClick={startStopwatch}>
                        <CaretRightOutlined />
                      </Button>
                    </>
                  ),
                  (t) => (
                    <>
                      <span>{t}</span>
                      <Button onClick={stopStopwatch}>
                        <BorderOutlined />
                      </Button>
                    </>
                  )
                )
              )
            }
          </div>
        </Blackout>
      </Card>
      <Card className={s.card} size="small" title="Add time">
        <Blackout isActive={RD.isPending(lastActivityStatus)}>
          <div className={s.timeBox}>
            <Input
              type="number"
              placeholder="Mins"
              onChange={e => setTime(O.fromNullable(+e.target.value))}
              value={pipe(time, O.map(x => `${x}`), O.getOrElse(() => ''))}
            />
            <Button disabled={O.isNone(time)} onClick={onSubmit}>
              <ArrowRightOutlined />
            </Button>
          </div>
        </Blackout>
      </Card>
      {/* <Card className={s.card} size="small" title="Statistics">
        <span>Not implemented yet</span>
      </Card> */}
      {contextHolder}
    </>
  );
};
