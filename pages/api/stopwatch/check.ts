import { Stopwatch } from '@domain/stopwatch';
import { dbService } from '@services/db';
import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/lib/function';
import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import type { NextApiRequest, NextApiResponse } from 'next';

// @api-client-method: POST
const handler = async (req: NextApiRequest, res: NextApiResponse<E.Either<string, O.Option<Stopwatch>>>) => {
  const stopwatch = await pipe(
    req.body,
    JSON.parse,
    data =>
      TE.tryCatch(
        () => dbService.stopwatch.findFirst({ where: { taskId: data.taskId } }),
        e => (e as Error).message
      ),
    TE.map(O.fromNullable)
  )();
  res.json(stopwatch);
};

export default handler;
