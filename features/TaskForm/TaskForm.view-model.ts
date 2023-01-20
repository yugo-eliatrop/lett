import { BehaviorSubject, of } from 'rxjs';
import { EditedTask } from '../../domain';
import { SubmitStatus } from './types';
import * as RD from '@devexperts/remote-data-ts';
import { apiTaskCreate, apiTaskRemove, apiTaskUpdate } from '../../api-client';

export const createTaskFormViewModel = () => {
  const statusSubject$ = new BehaviorSubject<SubmitStatus>(RD.initial);

  const onSubmit$ = of(async (task: EditedTask) => {
    statusSubject$.next(RD.pending);
    const res = await (task.id ? apiTaskUpdate : apiTaskCreate)(task);
    statusSubject$.next(res);
  });

  const onRemove$ = of(async (task: EditedTask) => {
    statusSubject$.next(RD.pending);
    const res = await apiTaskRemove(task);
    statusSubject$.next(res);
  });
  
  const status$ = statusSubject$.asObservable();

  return { onSubmit$, status$, onRemove$ };
};
