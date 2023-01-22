import { BehaviorSubject, of, from, shareReplay, Observable, merge, switchMap } from "rxjs";
import { Activity, Task, ActivitiesStatistics } from "../../domain";
import * as RD from '@devexperts/remote-data-ts';
import { apiActivityCreate, apiActivityByTask } from "../../api-client";

export const createTaskPlayerViewModel = (task: Task) => {
  const lastActivityStatusBS$ = new BehaviorSubject<RD.RemoteData<Error, Activity>>(RD.initial);
  const weekStatisticsBS$ = new BehaviorSubject<RD.RemoteData<Error, ActivitiesStatistics>>(RD.initial);

  const loadStatistics = () => from(apiActivityByTask({ id: task.id }));

  const weekStatistics$ = merge(
    weekStatisticsBS$.asObservable(),
    loadStatistics(),
  );

  const task$ = of(task);
  const lastActivityStatus$ = lastActivityStatusBS$.asObservable();

  const createActivity$ = of(async (time: number) => {
    lastActivityStatusBS$.next(RD.pending);
    // TO DO: remake as observable
    const res = await apiActivityCreate({ taskId: task.id, time, createdAt: new Date() });
    lastActivityStatusBS$.next(res);
    // TO DO: check subscription with WeakMap
    loadStatistics().subscribe(res => weekStatisticsBS$.next(res));
  });

  return { lastActivityStatus$, createActivity$, task$, weekStatistics$ };
};
