import { NotRequiredId } from './types';

import type { Task } from '@prisma/client';

export type { Task } from '@prisma/client';

export type EditedTask = NotRequiredId<Task>;
