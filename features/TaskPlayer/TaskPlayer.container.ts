import { withObservables } from "@utils/withObservables";
import { TaskPlayerView } from "./TaskPlayer.view";
import { createTaskPlayerViewModel } from "./TaskPlayer.view-model";
import { Task, Activity, ActivitiesStatistics } from '../../domain';
import * as RD from '@devexperts/remote-data-ts';

export const createTaskPlayerContainer = (task: Task) => {
  return withObservables(TaskPlayerView)(
    () => {
      const { createActivity$, lastActivityStatus$, task$, weekStatistics$ } = createTaskPlayerViewModel(task);
      return { lastActivityStatus: lastActivityStatus$, createActivity: createActivity$, task: task$, weekStatistics: weekStatistics$ };
    },
    {
      task,
      createActivity: (time: number) => {},
      lastActivityStatus: RD.initial as RD.RemoteData<Error, Activity>,
      weekStatistics: RD.initial as RD.RemoteData<Error, ActivitiesStatistics> }
  );
};
