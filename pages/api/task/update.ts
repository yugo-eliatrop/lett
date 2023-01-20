import { Task } from '../../../domain';
import type { NextApiRequest, NextApiResponse } from 'next'
import { dbService } from '../../../services/db';
import * as TE from 'fp-ts/TaskEither';
import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/lib/function';

// @api-client-method: POST
const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<E.Either<string, Task>>
) => {
  const data = JSON.parse(req.body);
  const task = await pipe(
    TE.tryCatch(
      () => dbService.task.update({ where: { id: data.id }, data }),
      (e) => (e as Error).message,
    )
  )();
  res.json(task);
}

export default handler;
