import * as RD from '@devexperts/remote-data-ts';
import { Stopwatch } from '@domain/stopwatch';
import { Task } from '@domain/task';
import { flow, pipe } from 'fp-ts/lib/function';
import * as O from 'fp-ts/Option';
import * as TO from 'fp-ts/TaskOption';
import { BehaviorSubject, from, merge, Observable, of, switchMap } from 'rxjs';

import { apiStopwatchCheck, apiStopwatchCreate, apiStopwatchDelete } from '../../api-client';

const rdToOption = <T>(rd: RD.RemoteData<unknown, T>): O.Option<T> =>
  RD.isSuccess(rd) ? O.fromNullable(rd.value) : O.none;

export const createStopwatchVM = (task: Task, onFinish: (mins: number) => void) => {
  const stopwatchBS$ = new BehaviorSubject<RD.RemoteData<Error, O.Option<Stopwatch>>>(RD.pending);

  const loadStopwatch = () => from(apiStopwatchCheck({ taskId: task.id }));

  const stopwatch$ = merge(stopwatchBS$.asObservable(), loadStopwatch());

  const startDate$: Observable<RD.RemoteData<Error, O.Option<Date>>> = stopwatch$.pipe(
    switchMap(flow(RD.map(flow(O.map(sw => new Date(sw.startDate)))), of))
  );

  const onStart$ = of(() => {
    stopwatchBS$.next(RD.pending);
    apiStopwatchCreate({ taskId: task.id, startDate: new Date() }).then(
      flow(RD.map(O.of), sw => stopwatchBS$.next(sw))
    );
  });

  const onStop$ = of(() => {
    const s = stopwatch$
      .pipe(
        switchMap(
          flow(
            RD.fold(
              () => O.none,
              () => O.none,
              () => O.none,
              flow(O.map(sw => sw.id))
            ),
            of
          )
        )
      )
      .subscribe(id => {
        pipe(
          id,
          TO.fromOption,
          TO.chain(id => TO.tryCatch(() => apiStopwatchDelete({ id }))),
          TO.chain(flow(rdToOption, TO.fromOption)),
          TO.map(mins => {
            onFinish(mins);
            stopwatchBS$.next(RD.initial);
            s.unsubscribe();
          })
        )();
      });
  });

  return { startDate$, onStart$, onStop$ };
};
