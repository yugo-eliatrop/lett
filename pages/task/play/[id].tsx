import { FC, useMemo } from 'react';

import { Task } from '../../../domain';
import { GetServerSideProps } from 'next';
import { dbService } from '@services/db';
import * as O from 'fp-ts/Option';
import * as TO from 'fp-ts/TaskOption';
import * as t from 'io-ts';
import { flow, pipe } from 'fp-ts/lib/function';
import { Layout } from '@ui/Layout';
import { createTaskPlayer } from '@features/TaskPlayer';

export const getServerSideProps: GetServerSideProps<EditTaskPageProps> = async (context) => {
  const task = await pipe(
    context,
    c => Number(c.query.id),
    t.number.decode,
    TO.fromEither,
    TO.chain((id) => TO.tryCatch(() => dbService.task.findFirst({ where: { id } }))),
    TO.chain(flow(TO.fromNullable)),
    TO.chain(t => t.active ? TO.of(t) : TO.none)
  )();
  return { props: { task } };
}

type EditTaskPageProps = {
  task: O.Option<Task>;
}

const EditTaskPage: FC<EditTaskPageProps> = ({ task }) => {
  const TaskPlayer = useMemo(() => pipe(
    task,
    O.fold(
      (): FC => () => <p>Task not found or disabled</p>,
      createTaskPlayer,
    ),
  ), [task]);
  
  return (
    <Layout title={pipe(task, O.map(t => `Run ${t.title}`), O.getOrElse(() => ''))}>
      <TaskPlayer />
    </Layout>
  )
}

export default EditTaskPage;
