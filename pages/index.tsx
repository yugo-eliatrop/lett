import { Layout } from '@ui/Layout'
import { FC } from 'react';
import { GetServerSideProps } from 'next';
import { dbService } from '@services/db';
import { TaskGoalStatisticsRecord, TaskStatistics } from '../domain';

import { Dashboard } from '@ui/Dashboard';

export const getServerSideProps: GetServerSideProps<HomeProps> = async () => {
  const t = new Date();
  const taskStatistics = await dbService.task.taskStatistics();
  const goalStatistics = await dbService.task.taskGoalStatistics();
  console.log('index rendered', new Date().getTime() - t.getTime());
  return {
    props: {
      taskStatistics,
      goalStatistics,
    }
  };
}

type HomeProps = {
  taskStatistics: TaskStatistics;
  goalStatistics: TaskGoalStatisticsRecord[];
}

const Home: FC<HomeProps> = ({ taskStatistics, goalStatistics }) => {
  return (
    <Layout title='Dashboard'>
      <Dashboard taskStatistics={taskStatistics} goalStatistics={goalStatistics} />
    </Layout>
  )
};

export default Home;
