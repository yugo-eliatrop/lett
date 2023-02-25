import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/lib/function';
import * as TE from 'fp-ts/TaskEither';
import type { NextApiRequest, NextApiResponse } from 'next';

import { ActivitiesStatistics } from '../../../domain';
import { dbService } from '../../../services/db';

// @api-client-method: POST
const handler = async (req: NextApiRequest, res: NextApiResponse<E.Either<string, ActivitiesStatistics>>) => {
  const stat = await pipe(
    req.body,
    JSON.parse,
    data =>
      TE.tryCatch(
        () => dbService.activity.byTaskAndThisWeek(data.id),
        e => (e as Error).message
      ),
    TE.map(s => s.map(item => ({ ...item, time: Number(item.time) })))
  )();
  res.json(stat);
};

export default handler;
