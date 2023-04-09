import { Activity } from '@domain/activity';
import { TaskMinsStatistics } from '@domain/task';
import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/lib/function';
import * as O from 'fp-ts/lib/Option';
import * as TE from 'fp-ts/TaskEither';
import type { NextApiRequest, NextApiResponse } from 'next';

import { dbService } from '../../../services/db';

const sum = (acts: Activity[]) => acts.reduce((sum, item) => sum + item.time, 0);

const filterByTwoWeeks = (acts: Activity[]) => {
  const now = new Date();
  const twoWeeksAgo = new Date(now.setDate(now.getDate() - 14));
  return acts.filter(({ createdAt }) => new Date(createdAt) > twoWeeksAgo);
};

const handleActivities = (activities: O.Option<Activity[]>): TaskMinsStatistics =>
  pipe(
    activities,
    O.map(acts => ({ total: sum(acts), lastTwoWeeks: pipe(acts, filterByTwoWeeks, sum) })),
    O.getOrElse(() => ({ total: 0, lastTwoWeeks: 0 }))
  );

// @api-client-method: POST
const handler = async (req: NextApiRequest, res: NextApiResponse<E.Either<string, TaskMinsStatistics>>) => {
  const stat = await pipe(
    req.body,
    JSON.parse,
    data =>
      TE.tryCatch(
        () => dbService.task.findFirst({ where: { id: data.id } }).activities(),
        e => (e as Error).message
      ),
    TE.map(activities => handleActivities(O.fromNullable(activities)))
  )();
  res.json(stat);
};

export default handler;
