import { Stopwatch } from '@domain/stopwatch';
import type { NextApiRequest, NextApiResponse } from 'next'
import { dbService } from '@services/db';
import * as TE from 'fp-ts/TaskEither';
import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/lib/function';

// @api-client-method: POST
const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<E.Either<string, Stopwatch>>
) => {
  const stopwatch = await pipe(
    req.body,
    JSON.parse,
    (data) => TE.tryCatch(
      () => dbService.stopwatch.create({ data: { ...data, startDate: new Date() } }),
      (e) => (e as Error).message,
    )
  )();
  res.json(stopwatch);
};

export default handler;
