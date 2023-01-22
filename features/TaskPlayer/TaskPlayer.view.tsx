import { FC, useEffect, useState } from "react";

import { ActivitiesStatistics, Activity, Task } from '../../domain';
import * as O from 'fp-ts/Option';
import * as RD from '@devexperts/remote-data-ts';
import { Card, Input, Button, Modal, Spin } from "antd";
import { pipe, flow } from "fp-ts/lib/function";

import s from './TaskPlayer.module.css';
import { CaretRightOutlined, ArrowRightOutlined, BorderOutlined } from "@ant-design/icons";
import { toMMSS } from "@utils/time-format";
import { interval, of, switchMap } from "rxjs";
import { Blackout } from "@ui/Blackout";

export type TaskPlayerProps = {
  task: Task;
  weekStatistics: RD.RemoteData<Error, ActivitiesStatistics>;
  createActivity: (time: number) => void;
  lastActivityStatus: RD.RemoteData<Error, Activity>;
}

export const TaskPlayerView: FC<TaskPlayerProps> = ({ task, createActivity, lastActivityStatus, weekStatistics }) => {
  const [stopwatch, setStopwatch] = useState<O.Option<number>>(O.none);
  const [time, setTime] = useState<O.Option<number>>(O.none);
  const [startDate, setStartDate] = useState<O.Option<Date>>(O.none);
  const [modal, contextHolder] = Modal.useModal();

  const onSubmit = () => {
    pipe(
      time,
      O.map(mins => createActivity(mins)),
    );
  };

  useEffect(() => {
    const sub = pipe(
      startDate,
      O.map(
        (d) => interval(1000).pipe(
            switchMap(() => of(O.of(Math.floor((new Date().getTime() - d.getTime()) / 1000)))
          )
        ).subscribe(setStopwatch),
      )
    );
    return () => {
      pipe(sub, O.map(s => s.unsubscribe()))
    };
  }, [startDate]);

  const startStopwatch = () => pipe(
    new Date(),
    O.of,
    setStartDate,
  );

  const stopStopwatch = () => {
    pipe(startDate, O.map(d => Math.round((new Date().getTime() - d.getTime()) / 60_000)), setTime)
    setStartDate(O.none);
    setStopwatch(O.none);
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
            <Button disabled={O.isNone(time) || !time.value} onClick={onSubmit}>
              <ArrowRightOutlined />
            </Button>
          </div>
        </Blackout>
      </Card>
      <Card className={s.card} size="small" title="Statistics">
        {
          pipe(
            weekStatistics,
            RD.fold(
              () => null,
              () => <Spin />,
              (e) => <p>{e.message}</p>,
              (stat) => (
                <>
                  {stat.length ? stat.map(st => (
                    <div className={s.timeBox} key={st.id}>
                      <span>{new Date(st.day).toDateString()}</span>
                      <span>{st.time}</span>
                    </div>
                  )) : (
                    <p>No statistics yet</p>
                  )}
                </>
              )
            )
          )
        }
      </Card>
      {contextHolder}
    </>
  );
};
