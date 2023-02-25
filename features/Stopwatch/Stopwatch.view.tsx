import { BorderOutlined, CaretRightOutlined } from '@ant-design/icons';
import * as RD from '@devexperts/remote-data-ts';
import { Blackout } from '@ui/Blackout';
import { toMMSS } from '@utils/time-format';
import { Button, Card, Typography } from 'antd';
import { pipe } from 'fp-ts/lib/function';
import * as O from 'fp-ts/Option';
import { FC, useEffect, useState } from 'react';
import { interval, of, switchMap } from 'rxjs';

type StopwatchViewProps = {
  startDate: RD.RemoteData<Error, O.Option<Date>>;
  onStop: () => void;
  onStart: () => void;
  theme?: {
    card?: string;
    timeBox?: string;
  };
  disabled: boolean;
};

export const StopwatchView: FC<StopwatchViewProps> = ({ startDate, onStart, onStop, theme, disabled }) => {
  const [stopwatch, setStopwatch] = useState<O.Option<number>>(O.none);

  const stopStopwatch = () => {
    onStop();
    setStopwatch(O.none);
  };

  useEffect(() => {
    const sub = pipe(
      startDate,
      RD.fold(
        () => O.none,
        () => O.none,
        () => O.none,
        d => d
      ),
      O.map(d => {
        setStopwatch(O.of(Math.floor((new Date().getTime() - d.getTime()) / 1000)));
        return d;
      }),
      O.map(d =>
        interval(1000)
          .pipe(switchMap(() => of(O.of(Math.floor((new Date().getTime() - d.getTime()) / 1000)))))
          .subscribe(setStopwatch)
      )
    );
    return () => {
      pipe(
        sub,
        O.map(s => s.unsubscribe())
      );
    };
  }, [startDate]);

  return (
    <Card className={theme?.card} size="small" title="Stopwatch">
      <Blackout isActive={disabled || RD.isPending(startDate)}>
        <div className={theme?.timeBox}>
          {pipe(
            stopwatch,
            O.map(toMMSS),
            O.fold(
              () => (
                <>
                  <Typography.Text>{toMMSS(0)}</Typography.Text>
                  <Button onClick={onStart}>
                    <CaretRightOutlined />
                  </Button>
                </>
              ),
              t => (
                <>
                  <Typography.Text>{t}</Typography.Text>
                  <Button onClick={stopStopwatch}>
                    <BorderOutlined />
                  </Button>
                </>
              )
            )
          )}
        </div>
      </Blackout>
    </Card>
  );
};
