import { RemoteData } from '@devexperts/remote-data-ts';
import { Task } from '../../domain';

// type Field<T> = {
//   value: T;
//   error?: string;
// };

// type FormFields = { [K in keyof FieldsToFill]: Field<FieldsToFill[K]> }

export type FieldsToValidate = Pick<Task, 'time' | 'title'>;

// export type FormFieldsErrors = Record<keyof FieldsToValidate, string>;

export type SubmitStatus = RemoteData<Error, Task>;
