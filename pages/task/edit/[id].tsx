import { TaskForm } from '@features/TaskForm';
import { dbService } from '@services/db';
import { Layout } from '@ui/Layout';
import { Typography } from 'antd';
import { flow, pipe } from 'fp-ts/lib/function';
import * as O from 'fp-ts/Option';
import * as TO from 'fp-ts/TaskOption';
import * as t from 'io-ts';
import { GetServerSideProps } from 'next';
import { FC } from 'react';

import { Task } from '../../../domain';

export const getServerSideProps: GetServerSideProps<EditTaskPageProps> = async context => {
  const task = await pipe(
    context,
    c => Number(c.query.id),
    t.number.decode,
    TO.fromEither,
    TO.chain(id => TO.tryCatch(() => dbService.task.findFirst({ where: { id } }))),
    TO.chain(flow(TO.fromNullable))
  )();
  return { props: { task } };
};

type EditTaskPageProps = {
  task: O.Option<Task>;
};

const EditTaskPage: FC<EditTaskPageProps> = ({ task }) => {
  return (
    <Layout title="Edit task">
      {pipe(
        task,
        O.fold(
          () => <Typography.Text>Task not found</Typography.Text>,
          task => <TaskForm editedTask={task} />
        )
      )}
    </Layout>
  );
};

export default EditTaskPage;
