import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/lib/function';
import * as TE from 'fp-ts/TaskEither';
import type { NextApiRequest, NextApiResponse } from 'next';

import { dbService } from '../../../services/db';

// @api-client-method: POST
const handler = async (req: NextApiRequest, res: NextApiResponse<E.Either<string, number>>) => {
  const stat = await pipe(
    req.body,
    JSON.parse,
    data =>
      TE.tryCatch(
        () => dbService.task.findFirst({ where: { id: data.id } }).activities(),
        e => (e as Error).message
      ),
    TE.map(activities => (activities ? activities.reduce((sum, item) => sum + item.time, 0) : 0))
  )();
  res.json(stat);
};

export default handler;
