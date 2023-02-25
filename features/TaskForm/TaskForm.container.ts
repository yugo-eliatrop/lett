import { initial } from '@devexperts/remote-data-ts';

import { EditedTask } from '../../domain';
import { withObservables } from '../../utils/withObservables';
import { TaskFormView } from './TaskForm.view';
import { createTaskFormViewModel } from './TaskForm.view-model';
import { SubmitStatus } from './types';

export const TaskFormContainer = withObservables(TaskFormView)(
  () => {
    const vm = createTaskFormViewModel();
    return { status: vm.status$, onSubmit: vm.onSubmit$, onRemove: vm.onRemove$ };
  },
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  { status: initial as SubmitStatus, onSubmit: (_: EditedTask) => {}, onRemove: (_: EditedTask) => {} }
);
