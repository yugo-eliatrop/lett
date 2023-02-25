import { TaskList } from '@ui/TaskList';
import { GetServerSideProps } from 'next';
import { FC } from 'react';

import { Task } from '../../domain';
import { dbService } from '../../services/db';
import { Layout } from '../../ui/Layout';

export const getServerSideProps: GetServerSideProps<TasksPageProps> = async () => {
  const rawTasks = (await dbService.task.findMany()).sort((a, b) => (a.title > b.title ? 1 : -1));
  const activeTasks = rawTasks.filter(t => t.active);
  const disabledTasks = rawTasks.filter(t => !t.active);
  const runningTaskIds = (await dbService.stopwatch.findMany()).map(sw => sw.taskId);
  return { props: { tasks: [...activeTasks, ...disabledTasks], runningTaskIds } };
};

type TasksPageProps = {
  tasks: Task[];
  runningTaskIds: number[];
};

const TasksPage: FC<TasksPageProps> = ({ tasks, runningTaskIds }) => {
  return (
    <Layout title="Tasks">
      <TaskList data={tasks} runningTaskIds={new Set(runningTaskIds)} />
    </Layout>
  );
};

export default TasksPage;
