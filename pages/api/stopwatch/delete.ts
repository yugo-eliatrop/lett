import { dbService } from '@services/db';
import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/lib/function';
import * as TE from 'fp-ts/TaskEither';
import type { NextApiRequest, NextApiResponse } from 'next';

// @api-client-method: POST
const handler = async (req: NextApiRequest, res: NextApiResponse<E.Either<string, number>>) => {
  const result = await pipe(
    req.body,
    JSON.parse,
    data =>
      TE.tryCatch(
        () => dbService.stopwatch.delete({ where: { id: data.id } }),
        e => (e as Error).message
      ),
    TE.map(sw => Math.round((new Date().getTime() - sw.startDate.getTime()) / 60_000))
  )();
  res.json(result);
};

export default handler;
