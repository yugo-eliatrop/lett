import { Task } from "@domain/task";
import { withObservables } from "@utils/withObservables";
import { StopwatchView } from "./Stopwatch.view";
import { createStopwatchVM } from "./Stopwatch.view-model";
import * as O from 'fp-ts/Option';
import * as RD from '@devexperts/remote-data-ts';

export const createStopwatch = (task: Task, onFinish: (mins: number) => void) => {
  return withObservables(StopwatchView)(
    () => {
      const vm = createStopwatchVM(task, onFinish);
      return { startDate: vm.startDate$, onStart: vm.onStart$, onStop: vm.onStop$ };
    },
    { startDate: RD.initial as RD.RemoteData<Error, O.Option<Date>>, onStart: () => {}, onStop: () => {} }
  )
}
