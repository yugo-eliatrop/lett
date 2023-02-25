import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/lib/function';
import * as TE from 'fp-ts/TaskEither';
import type { NextApiRequest, NextApiResponse } from 'next';

import { Activity } from '../../../domain';
import { dbService } from '../../../services/db';

// @api-client-method: POST
const handler = async (req: NextApiRequest, res: NextApiResponse<E.Either<string, Activity>>) => {
  const activity = await pipe(req.body, JSON.parse, data =>
    TE.tryCatch(
      () => dbService.activity.create({ data }),
      e => (e as Error).message
    )
  )();
  res.json(activity);
};

export default handler;
