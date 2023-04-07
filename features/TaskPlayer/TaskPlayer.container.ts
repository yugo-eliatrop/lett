import * as RD from '@devexperts/remote-data-ts';
import { withObservables } from '@utils/withObservables';

import { ActivitiesStatistics, Activity, Task } from '../../domain';
import { TaskPlayerView } from './TaskPlayer.view';
import { createTaskPlayerViewModel } from './TaskPlayer.view-model';

export const createTaskPlayerContainer = (task: Task) => {
  return withObservables(TaskPlayerView)(
    () => {
      const { createActivity$, lastActivityStatus$, task$, weekStatistics$, totalMins$ } =
        createTaskPlayerViewModel(task);
      return {
        lastActivityStatus: lastActivityStatus$,
        createActivity: createActivity$,
        task: task$,
        weekStatistics: weekStatistics$,
        totalMins: totalMins$,
      };
    },
    {
      task,
      // eslint-disable-next-line
      createActivity: (time: number) => {},
      lastActivityStatus: RD.initial as RD.RemoteData<Error, Activity>,
      weekStatistics: RD.initial as RD.RemoteData<Error, ActivitiesStatistics>,
      totalMins: RD.initial as RD.RemoteData<Error, number>,
    }
  );
};
