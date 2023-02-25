import { Layout } from '@ui/Layout'
import { FC, useMemo } from 'react';
import { GetServerSideProps } from 'next';
import { dbService } from '@services/db';
import { TaskGoalStatisticsRecord, TaskStatistics } from '../domain';

import { Dashboard } from '@ui/Dashboard';

export const getServerSideProps: GetServerSideProps<HomeProps> = async () => {
  const taskStatistics = await dbService.task.taskStatistics();
  const goalStatistics = await dbService.task.taskGoalStatistics();
  const stopwatches = await dbService.stopwatch.findMany();
  return {
    props: {
      taskStatistics,
      goalStatistics,
      runningTaskIds: stopwatches.map(({ taskId }) => taskId),
    }
  };
}

type HomeProps = {
  taskStatistics: TaskStatistics;
  goalStatistics: TaskGoalStatisticsRecord[];
  runningTaskIds: number[];
}

const Home: FC<HomeProps> = ({ taskStatistics, goalStatistics, runningTaskIds }) => {
  const runningTaskIdsSet = useMemo(() => new Set(runningTaskIds), [runningTaskIds]);

  return (
    <Layout title='Dashboard'>
      <Dashboard taskStatistics={taskStatistics} goalStatistics={goalStatistics} runningTaskIds={runningTaskIdsSet} />
    </Layout>
  )
};

export default Home;
