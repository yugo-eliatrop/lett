import { Task } from "@domain/task";
import { Stopwatch } from "@domain/stopwatch";
import { BehaviorSubject, from, merge, Observable, of, switchMap } from "rxjs";
import * as O from 'fp-ts/Option';
import * as TO from 'fp-ts/TaskOption';
import * as RD from '@devexperts/remote-data-ts';
import { apiStopwatchCheck, apiStopwatchCreate, apiStopwatchDelete } from "../../api-client";
import { flow, pipe } from "fp-ts/lib/function";

const rdToOption = <T>(rd: RD.RemoteData<unknown, T>): O.Option<T> => RD.isSuccess(rd) ? O.fromNullable(rd.value) : O.none;

export const createStopwatchVM = (task: Task, onFinish: (mins: number) => void) => {
  const stopwatchBS$ = new BehaviorSubject<O.Option<Stopwatch>>(O.none);

  const loadStopwatch = (): Observable<O.Option<Stopwatch>> => from(apiStopwatchCheck({ taskId: task.id })).pipe(
    switchMap(
      flow(
        rdToOption,
        O.chain(x => x),
        of
      )
    )
  );

  const stopwatch$ = merge(
    stopwatchBS$.asObservable(),
    loadStopwatch(),
  );

  const startDate$: Observable<O.Option<Date>> = stopwatch$.pipe(switchMap(flow(O.map(sw => new Date(sw.startDate)), of)));

  const onStart$ = of(() => apiStopwatchCreate({ taskId: task.id }).then(
    flow(
      rdToOption,
      sw => stopwatchBS$.next(sw),
    )
  ));

  const onStop$ = of(() => {
    stopwatch$.pipe(
      switchMap(flow(O.map(sw => sw.id), of))
    ).subscribe(id => {
      pipe(
        id,
        TO.fromOption,
        TO.chain(id => TO.tryCatch(() => apiStopwatchDelete({ id }))),
        TO.chain(flow(rdToOption, TO.fromOption)),
        TO.map(mins => {
          onFinish(mins);
          stopwatchBS$.next(O.none);
        }),
      )();
    });
  });

  return { startDate$, onStart$, onStop$ };
};
