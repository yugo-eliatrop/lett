import { RemoteData } from '@devexperts/remote-data-ts';

import { Task } from '../../domain';

export type FieldsToValidate = Pick<Task, 'time' | 'title'>;

export type SubmitStatus = RemoteData<Error, Task>;
