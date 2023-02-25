import { createTaskPlayer } from '@features/TaskPlayer';
import { dbService } from '@services/db';
import { Layout } from '@ui/Layout';
import { Typography } from 'antd';
import { flow, pipe } from 'fp-ts/lib/function';
import * as O from 'fp-ts/Option';
import * as TO from 'fp-ts/TaskOption';
import * as t from 'io-ts';
import { GetServerSideProps } from 'next';
import { FC, useMemo } from 'react';

import { Task } from '../../domain';

export const getServerSideProps: GetServerSideProps<EditTaskPageProps> = async context => {
  const task = await pipe(
    context,
    c => Number(c.query.id),
    t.number.decode,
    TO.fromEither,
    TO.chain(id => TO.tryCatch(() => dbService.task.findFirst({ where: { id } }))),
    TO.chain(flow(TO.fromNullable)),
    TO.chain(t => (t.active ? TO.of(t) : TO.none))
  )();
  return { props: { task } };
};

type EditTaskPageProps = {
  task: O.Option<Task>;
};

const EditTaskPage: FC<EditTaskPageProps> = ({ task }) => {
  const TaskPlayer = useMemo(
    () =>
      pipe(
        task,
        O.fold((): FC => () => <Typography.Text>Task not found or disabled</Typography.Text>, createTaskPlayer)
      ),
    [task]
  );

  return (
    <Layout
      title={pipe(
        task,
        O.map(t => t.title),
        O.getOrElse(() => '')
      )}
    >
      <TaskPlayer />
    </Layout>
  );
};

export default EditTaskPage;
