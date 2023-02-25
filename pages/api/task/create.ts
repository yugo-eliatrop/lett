import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/lib/function';
import * as TE from 'fp-ts/TaskEither';
import type { NextApiRequest, NextApiResponse } from 'next';

import { Task } from '../../../domain';
import { dbService } from '../../../services/db';

// @api-client-method: POST
const handler = async (req: NextApiRequest, res: NextApiResponse<E.Either<string, Task>>) => {
  const task = await pipe(req.body, JSON.parse, data =>
    TE.tryCatch(
      () => dbService.task.create({ data }),
      e => (e as Error).message
    )
  )();
  res.json(task);
};

export default handler;
