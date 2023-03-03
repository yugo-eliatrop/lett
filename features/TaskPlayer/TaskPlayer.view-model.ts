import * as RD from '@devexperts/remote-data-ts';
import { BehaviorSubject, from, merge, of } from 'rxjs';

import { apiActivityByTask, apiActivityCreate } from '../../api-client';
import { ActivitiesStatistics, Activity, Task } from '../../domain';

export const createTaskPlayerViewModel = (task: Task) => {
  const lastActivityStatusBS$ = new BehaviorSubject<RD.RemoteData<Error, Activity>>(RD.initial);
  const weekStatisticsBS$ = new BehaviorSubject<RD.RemoteData<Error, ActivitiesStatistics>>(RD.pending);

  const loadStatistics = () => from(apiActivityByTask({ id: task.id }));

  const weekStatistics$ = merge(weekStatisticsBS$.asObservable(), loadStatistics());

  const task$ = of(task);
  const lastActivityStatus$ = lastActivityStatusBS$.asObservable();

  const createActivity$ = of(async (time: number) => {
    lastActivityStatusBS$.next(RD.pending);
    weekStatisticsBS$.next(RD.pending);
    // TO DO: remake as observable
    const res = await apiActivityCreate({ taskId: task.id, time });
    lastActivityStatusBS$.next(res);
    // TO DO: check subscription with WeakMap
    loadStatistics().subscribe(res => weekStatisticsBS$.next(res));
  });

  return { lastActivityStatus$, createActivity$, task$, weekStatistics$ };
};
